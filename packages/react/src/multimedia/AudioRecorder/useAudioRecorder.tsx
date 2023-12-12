import { useCallback, useEffect, useReducer, useRef } from "react";

import {
  Pause,
  PlayFilled,
  Record,
  Refresh,
  Restart,
  Save,
} from "@edifice-ui/icons";
import { WorkspaceElement } from "edifice-ts-client";
import pako from "pako";

import { ToolbarItem } from "../../components";

export type RecordState =
  | "IDLE"
  | "RECORDING"
  | "PAUSED"
  | "RECORDED"
  | "SAVING"
  | "SAVED";

export type PlayState = "IDLE" | "PLAYING" | "PAUSED";

type AudioReducerState = {
  recordState: RecordState;
  playState: PlayState;

  // The audio recorder is based on the Web Audio API (https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
  // See also https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode for more information.
  micStream?: MediaStream;
  micStreamAudioSourceNode?: MediaStreamAudioSourceNode;
  audioWorkletNode?: AudioWorkletNode;
  audioContext?: AudioContext;

  // encoder and web socket for sending encoded audio to the backend
  encoderWorker?: Worker;
  webSocket?: WebSocket | null;
  compress?: boolean;
  leftChannel: Float32Array[];
  rightChannel: Float32Array[];
};

export default function useAudioRecorder(
  onSuccess: (resource: WorkspaceElement) => void,
  onError: (error: string) => void,
) {
  function audioReducer(
    state: AudioReducerState,
    action: {
      type: "update" | "updateChannels";
      updatedState?: Partial<AudioReducerState>;
      updateChannels?: {
        leftChannel: Float32Array;
        rightChannel: Float32Array;
      };
    },
  ): AudioReducerState {
    if (action.type === "updateChannels" && action.updateChannels) {
      return {
        ...state,
        leftChannel: [...state.leftChannel, action.updateChannels.leftChannel],
        rightChannel: [
          ...state.rightChannel,
          action.updateChannels.rightChannel,
        ],
      };
    }
    return { ...state, ...action.updatedState };
  }

  const [
    {
      recordState,
      playState,
      micStream,
      micStreamAudioSourceNode,
      audioWorkletNode,
      audioContext,
      encoderWorker,
      webSocket,
      compress,
      leftChannel,
      rightChannel,
    },
    dispatch,
  ] = useReducer(audioReducer, {
    recordState: "IDLE",
    playState: "IDLE",
    leftChannel: [],
    rightChannel: [],
  });
  const audioNameRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const BUFFER_SIZE: number = 128; // https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor
  const DEFAULT_SAMPLE_RATE: number = 44100;

  // Init Web Socket to send audio chunks to backend
  useEffect(() => {
    const ws = new WebSocket(
      getUrl(audioContext?.sampleRate || DEFAULT_SAMPLE_RATE),
    );
    dispatch({ type: "update", updatedState: { webSocket: ws } });

    ws.onopen = () => {
      if (audioRef.current && audioRef.current.currentTime > 0) {
        audioRef.current.currentTime = 0;
      }
      ws.send("open");
      if (!compress) {
        ws.send("rawdata");
      }
    };
    ws.onerror = (event: Event) => {
      console.error(event);
      dispatch({
        type: "update",
        updatedState: { playState: "IDLE", recordState: "IDLE" },
      });
      closeWs();
    };
    ws.onclose = () => {
      clearWs();
    };

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
      dispatch({ type: "update", updatedState: { webSocket: null } });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Init encoder worker
  useEffect(() => {
    const encoderWorker = new Worker("/infra/public/js/audioEncoder.js");
    dispatch({
      type: "update",
      updatedState: { encoderWorker: encoderWorker },
    });
    encoderWorker.postMessage([
      "init",
      audioContext?.sampleRate || DEFAULT_SAMPLE_RATE,
    ]);

    return () => {
      closeAudioStream();
      encoderWorker.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send audio chunks to backend + save
  useEffect(() => {
    if (!webSocket) {
      return;
    }

    webSocket.onmessage = async (event) => {
      if (
        event.data &&
        event.data.indexOf &&
        typeof event.data.indexOf === "function" &&
        event.data.indexOf("error") !== -1
      ) {
        console.error(event.data);
        dispatch({
          type: "update",
          updatedState: { playState: "IDLE", recordState: "IDLE" },
        });
        closeWs();
      } else if (
        event.data &&
        event.data.text &&
        typeof event.data.text === "function" &&
        recordState === "SAVING"
      ) {
        const data = JSON.parse(await event.data.text());
        if (data.status === "ok") {
          closeWs();
          const mockWorkspaceAudio = {
            _id: data.docId,
            name: audioNameRef.current?.value,
            eType: "file",
            eParent: "",
            children: [],
            created: new Date(),
            _shared: [],
            _isShared: false,
            owner: { userId: "", displayName: "" },
          } as any as WorkspaceElement;

          if (mockWorkspaceAudio) {
            onSuccess(mockWorkspaceAudio);
          } else {
            onError("");
          }

          closeAudioStream();
          dispatch({ type: "update", updatedState: { recordState: "SAVED" } });
        } else {
          dispatch({ type: "update", updatedState: { recordState: "IDLE" } });
          closeWs();
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webSocket, recordState]);

  /**
   * Handle message received from the audio recorder processor.
   * Basically the Audio recorder processor returns the input channels that will be treated by the audioEncoder worker.
   * The audio recorder processor script is located here: /infra/public/js/audio-recorder-processor.js
   * The script follows the AudioWorkletProcessor API (https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor)
   * This method gets called for each block of 128 sample-frames.
   *
   * @param event is the input returned, containing leftChannel and rightChannel arrays.
   */
  const handleAudioWorkletNodeMessage = useCallback(
    (event: MessageEvent) => {
      const leftChannel = (event.data.inputs as Float32Array[][])[0][0];
      const rightChannel = (event.data.inputs as Float32Array[][])[0][1];
      dispatch({
        type: "updateChannels",
        updateChannels: {
          leftChannel: leftChannel,
          rightChannel: rightChannel,
        },
      });

      if (encoderWorker) {
        // send audio data to encoder worker
        encoderWorker.postMessage([
          "chunk",
          [leftChannel],
          [rightChannel],
          BUFFER_SIZE,
        ]);

        // chunk encodedData received from ths  encoder worker
        encoderWorker.onmessage = function (event: MessageEvent) {
          const encodedData: Uint8Array = event.data as Uint8Array;

          // send encoded data to websocket
          if (!compress) {
            webSocket?.send(encodedData);
            return;
          }
          const initialTime = performance.now();
          webSocket?.send(pako.deflate(encodedData));
          const endTime = performance.now();
          if (endTime - initialTime > 50) {
            dispatch({ type: "update", updatedState: { compress: false } });
            webSocket?.send("rawdata");
          }
        };
      }
    },
    [compress, encoderWorker, webSocket],
  );

  /**
   * Close opened audio stream and clean channels
   */
  const closeAudioStream = useCallback(() => {
    // Close audio stream
    micStream?.getTracks().forEach((track) => track.stop());
    micStreamAudioSourceNode?.disconnect();
    audioWorkletNode?.port.removeEventListener(
      "message",
      handleAudioWorkletNodeMessage,
    );
    audioWorkletNode?.port.close();
    audioWorkletNode?.disconnect();
    audioContext?.close();
  }, [
    audioContext,
    audioWorkletNode,
    handleAudioWorkletNodeMessage,
    micStream,
    micStreamAudioSourceNode,
  ]);

  const initRecording = async () => {
    // Request access to the user's microphone
    const micStream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // Create the microphone stream
    const audioContext = new AudioContext({ sampleRate: DEFAULT_SAMPLE_RATE });
    const micStreamAudioSourceNode: MediaStreamAudioSourceNode =
      audioContext.createMediaStreamSource(micStream);
    dispatch({
      type: "update",
      updatedState: {
        micStream,
        micStreamAudioSourceNode,
        audioContext,
      },
    });

    // Create and connect AudioWorkletNode for processing the audio stream
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor
    try {
      await audioContext.audioWorklet.addModule(
        "/infra/public/js/audio-recorder-processor.js",
      );
    } catch (err) {
      console.error(err);
    }

    const audioWorkletNode = new AudioWorkletNode(
      audioContext,
      "audio-recorder-processor",
    );

    // Message received from the audio recorder processor. cf handleAudioWorkletNodeMessage function.
    // Basically the Audio recorder processor returns the input channels that will be treated by the audioEncoder worker.
    audioWorkletNode.port.addEventListener(
      "message",
      handleAudioWorkletNodeMessage,
    );

    dispatch({
      type: "update",
      updatedState: {
        audioWorkletNode,
        // Clear channels before strating recording
        leftChannel: [],
        rightChannel: [],
      },
    });

    audioWorkletNode.port.start();

    micStreamAudioSourceNode.connect(audioWorkletNode);
    audioWorkletNode.connect(audioContext.destination);
  };

  const handleRecord = async () => {
    dispatch({
      type: "update",
      updatedState: { recordState: "RECORDING", playState: "IDLE" },
    });

    await initRecording();
  };

  const handleRecordPause = useCallback(() => {
    if (audioContext?.state === "running") {
      dispatch({ type: "update", updatedState: { recordState: "PAUSED" } });
      audioContext?.suspend();
      if (encoderWorker) {
        encoderWorker.postMessage([
          "wav",
          rightChannel,
          leftChannel,
          rightChannel.length * BUFFER_SIZE,
        ]);
        encoderWorker.onmessage = (event: MessageEvent) => {
          if (audioRef.current) {
            audioRef.current.src = window.URL.createObjectURL(event.data);
          }
        };
      }
    } else {
      dispatch({ type: "update", updatedState: { recordState: "RECORDING" } });
      audioContext?.resume();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  }, [audioContext, encoderWorker, leftChannel, rightChannel]);

  const handlePlay = useCallback(() => {
    dispatch({ type: "update", updatedState: { playState: "PLAYING" } });
    if (audioRef?.current?.currentTime) {
      audioRef.current.play();
    } else {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  }, [audioRef]);

  const handlePlayPause = useCallback(() => {
    audioRef?.current?.pause();
    dispatch({ type: "update", updatedState: { playState: "PAUSED" } });
  }, [audioRef]);

  const handleReset = useCallback(() => {
    closeAudioStream();
    dispatch({
      type: "update",
      updatedState: {
        playState: "IDLE",
        recordState: "IDLE",
        leftChannel: [],
        rightChannel: [],
      },
    });
  }, [closeAudioStream]);

  const handleSave = useCallback(() => {
    dispatch({ type: "update", updatedState: { recordState: "SAVING" } });

    webSocket?.send(`save-${audioNameRef.current?.value}`);
  }, [webSocket]);

  const handlePlayStop = useCallback(() => {
    // Stop Playing the record
    if (audioRef?.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    dispatch({ type: "update", updatedState: { playState: "IDLE" } });
  }, [audioRef]);

  const handlePlayEnded = useCallback(() => {
    dispatch({ type: "update", updatedState: { playState: "PAUSED" } });
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [audioRef]);

  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  function getUrl(sampleRate: number) {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    let host: string = window.location.host;
    if (
      window.location.host === "localhost:8090" ||
      window.location.host === "localhost:3000"
    ) {
      host = "recette-ode1.opendigitaleducation.com";
    }
    const base = protocol + "://" + host;
    return `${base}/audio/${uuid()}?sampleRate=${sampleRate}`;
  }

  function closeWs() {
    if (webSocket) {
      if (webSocket.readyState === 1) {
        webSocket.close();
      }
    }
    clearWs();
  }

  function clearWs() {
    dispatch({ type: "update", updatedState: { webSocket: null } });
  }

  const toolbarItems: ToolbarItem[] = [
    {
      type: "icon",
      name: "record",
      visibility:
        recordState === "RECORDING" || recordState === "PAUSED"
          ? "hide"
          : "show",
      props: {
        icon: <Record color="" />,
        color: "danger",
        disabled: recordState !== "IDLE",
        onClick: handleRecord,
      },
    },
    {
      type: "icon",
      name: "recordPause",
      visibility:
        recordState === "RECORDING" || recordState === "PAUSED"
          ? "show"
          : "hide",
      props: {
        icon: (
          <Pause className={recordState === "PAUSED" ? "text-danger" : ""} />
        ),
        disabled: recordState !== "RECORDING" && recordState !== "PAUSED",
        onClick: handleRecordPause,
      },
    },
    { type: "divider" },
    {
      type: "icon",
      name: "play",
      visibility: playState === "PLAYING" ? "hide" : "show",
      props: {
        icon: <PlayFilled />,
        disabled:
          recordState !== "RECORDED" &&
          recordState !== "PAUSED" &&
          recordState !== "SAVED" &&
          playState !== "PAUSED",
        onClick: handlePlay,
      },
    },
    {
      type: "icon",
      name: "playPause",
      visibility: playState === "PLAYING" ? "show" : "hide",
      props: {
        icon: <Pause />,
        disabled: playState !== "PLAYING",
        onClick: handlePlayPause,
      },
    },
    {
      type: "icon",
      name: "stop",
      props: {
        icon: <Restart />,
        disabled: playState !== "PLAYING" && playState !== "PAUSED",
        onClick: handlePlayStop,
      },
    },
    { type: "divider" },
    {
      type: "icon",
      name: "reset",
      props: {
        icon: <Refresh />,
        disabled:
          recordState !== "RECORDED" &&
          playState !== "PLAYING" &&
          playState !== "PAUSED" &&
          recordState !== "PAUSED",
        onClick: handleReset,
      },
    },
    {
      type: "icon",
      name: "save",
      props: {
        icon: <Save />,
        disabled:
          (recordState !== "RECORDED" &&
            recordState !== "PAUSED" &&
            playState !== "PLAYING" &&
            playState !== "PAUSED") ||
          recordState === "SAVED" ||
          !audioNameRef.current?.value,
        onClick: handleSave,
      },
    },
  ];

  return {
    recordState,
    playState,
    recordtime: audioContext?.currentTime
      ? audioContext?.currentTime * 1000
      : undefined,
    audioRef,
    audioNameRef,
    toolbarItems,
    handlePlayEnded,
  };
}
