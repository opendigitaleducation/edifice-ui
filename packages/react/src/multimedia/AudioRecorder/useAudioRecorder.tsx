import { useCallback, useEffect, useRef, useState } from "react";

import {
  Pause,
  PlayFilled,
  Record,
  RecordStop,
  Refresh,
  Save,
} from "@edifice-ui/icons";

import { ToolbarItem } from "../../components";

export type RecordState =
  | "IDLE"
  | "RECORDING"
  | "PAUSED"
  | "RECORDED"
  | "SAVING"
  | "SAVED";

export type PlayState = "IDLE" | "PLAYING" | "PAUSED";

export default function useAudioRecorder(
  onAudioSaved?: (file: Blob, fileName: string) => void,
) {
  const [recordState, setRecordState] = useState<RecordState>("IDLE");
  const [playState, setPlayState] = useState<PlayState>("IDLE");

  const [audioStream, setAudioStream] = useState<MediaStream>();
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [finalAudioBlob, setFinalAudioBlob] = useState<Blob>();

  const [startTime, setStartTime] = useState<number>(0);
  const [recordedTime, setRecordedTime] = useState<number>(0);
  const [playedTime, setPlayedTime] = useState<number>(0);
  const [maxDuration] = useState<number>(180_000);

  const audioNameRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const enableAudioStream = useCallback(async () => {
    try {
      // Request the user’s media stream’s permission
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setAudioStream(stream);
    } catch (error) {
      console.error(error);
    }
  }, []);

  /**
   * Enable audio stream and stop streaming on clean up.
   */
  useEffect(() => {
    if (!audioStream) {
      enableAudioStream();
    }
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioStream, enableAudioStream]);

  /**
   * Get last updated recorded chunk and set the recorded video as source for user to play it.
   */
  useEffect(() => {
    if (audioChunks.length && audioRef.current) {
      const finalAudio: Blob = new Blob(audioChunks, { type: "audio/webm" });
      setFinalAudioBlob(finalAudio);
      audioRef.current.autoplay = false;
      audioRef.current.srcObject = null;
      audioRef.current.src = window.URL.createObjectURL(finalAudio);
    }
  }, [audioChunks]);

  /**
   * Handle recording countup.
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (recordState === "RECORDING") {
        setRecordedTime((prev) => {
          if (prev + 500 > maxDuration) {
            setRecordState("RECORDED");
            recorderRef?.current?.stop();
            return prev;
          }

          return prev + 500; // add 500ms
        });
      }
    }, 500);

    return () => {
      window.clearInterval(timer);
    };
  }, [startTime, recordState, maxDuration]);

  /**
   * Handle playing countup.
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (playState === "PLAYING") {
        setPlayedTime((prev) => {
          return prev + 500; // add 500ms
        });
      }
    }, 500);

    return () => {
      window.clearInterval(timer);
    };
  }, [startTime, playState]);

  const handleRecord = useCallback(() => {
    if (audioStream) {
      recorderRef.current = new MediaRecorder(audioStream);
      recorderRef.current.ondataavailable = ({ data }: BlobEvent) => {
        if (data.size > 0) {
          setAudioChunks((prev) => [...prev, data]);
        }
        if (recordedTime >= maxDuration) {
          setRecordState("RECORDED");
          recorderRef.current?.stop();
        }
      };
      recorderRef.current.onerror = (event) => console.error(event);
      recorderRef.current.start(1000); // collect 1000ms of data

      console.log("RECORD");
      setStartTime(Date.now());
      setRecordState("RECORDING");
    }
  }, [audioStream, recordedTime, maxDuration]);

  const handleRecordPause = useCallback(() => {
    if (recorderRef?.current?.state === "recording") {
      // We are recording we want to pause the recording
      console.log("RECORDING PAUSED");
      recorderRef?.current?.pause();
      setRecordState("PAUSED");
    } else {
      // We paused the recording we want to resume it
      console.log("RESUME RECORDING");
      recorderRef?.current?.resume();
      setRecordState("RECORDING");
    }
  }, []);

  const handlePlayStop = useCallback(() => {
    console.log("STOP PLAYING");

    // Stop Playing the record
    if (audioRef?.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayState("IDLE");
    setPlayedTime(0);
  }, []);

  const handlePlay = useCallback(() => {
    console.log("PLAYING");
    setPlayState("PLAYING");
    audioRef?.current?.play();
  }, []);

  const handlePlayPause = useCallback(() => {
    // We are playing the record we want to pause
    console.log("PAUSED PAYING");
    audioRef?.current?.pause();
    setPlayState("PAUSED");
  }, []);

  const handleReset = useCallback(() => {
    console.log("RESET");
    setRecordState("IDLE");
    setPlayState("IDLE");
    setStartTime(0);
    setRecordedTime(0);
    setAudioChunks([]);
    setFinalAudioBlob(undefined);
    enableAudioStream();
  }, [enableAudioStream]);

  const handleSave = useCallback(() => {
    console.log("SAVE");
    setRecordState("IDLE");

    if (recorderRef?.current?.state === "paused") {
      recorderRef.current.stop();
    }

    console.log("Blob :", finalAudioBlob);

    if (!finalAudioBlob) {
      console.error("Error while saving audio: recorded audio is undefined.");
      return;
    }

    onAudioSaved?.(finalAudioBlob, audioNameRef.current?.value);
  }, [finalAudioBlob, onAudioSaved]);

  const handleEnded = useCallback(() => {
    setPlayState("IDLE");
    setPlayedTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, []);

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
          <Pause
            style={
              recordState === "PAUSED" ? { color: "var(--edifice-danger)" } : {}
            }
          />
        ),
        disabled: recordState !== "RECORDING" && recordState !== "PAUSED",
        onClick: handleRecordPause,
      },
    },
    { type: "divider" },
    {
      type: "icon",
      name: "stop",
      props: {
        icon: <RecordStop />,
        disabled: playState !== "PLAYING" && playState !== "PAUSED",
        onClick: handlePlayStop,
      },
    },
    {
      type: "icon",
      name: "play",
      visibility: playState === "PLAYING" ? "hide" : "show",
      props: {
        icon: <PlayFilled />,
        disabled:
          recordState !== "RECORDED" &&
          recordState !== "PAUSED" &&
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
          recordState !== "RECORDED" &&
          recordState !== "PAUSED" &&
          playState !== "PLAYING" &&
          playState !== "PAUSED",
        onClick: handleSave,
      },
    },
  ];

  return {
    recordState,
    playState,
    recordedTime,
    playedTime,
    maxDuration,
    audioRef,
    toolbarItems,
    audioNameRef,
    handleEnded,
  };
}
