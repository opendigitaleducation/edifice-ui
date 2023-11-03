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
  | "RECORDED"
  | "PLAYING"
  | "PAUSED"
  | "SAVING"
  | "SAVED";

export default function useAudioRecorder() {
  const [state, setState] = useState<RecordState>("IDLE");

  const [audioStream, setAudioStream] = useState<MediaStream>();
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [finalAudioBlob, setFinalAudioBlob] = useState<Blob>();

  const [startTime, setStartTime] = useState<number>(0);
  const [recordedTime, setRecordedTime] = useState<number>(0);
  const [playedTime, setPlayedTime] = useState<number>(0);
  const [maxDuration] = useState<number>(180000);

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
   * Get last updated recorded chunk and set the recorded video as source for user to watch it.
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
      setRecordedTime((prev) => {
        if (state === "RECORDING") {
          return prev + 500; // add 500ms
        }
        return prev;
      });
    }, 500);

    return () => {
      window.clearInterval(timer);
    };
  }, [startTime, state]);

  /**
   * Handle playing countup.
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlayedTime((prev) => {
        if (state === "PLAYING") {
          return prev + 500; // add 500ms
        }
        return prev;
      });
    }, 500);

    return () => {
      window.clearInterval(timer);
    };
  }, [startTime, state]);

  const handleRecord = useCallback(() => {
    console.log("RECORD");
    setStartTime(Date.now());
    setState("RECORDING");

    if (audioStream) {
      recorderRef.current = new MediaRecorder(audioStream);
      recorderRef.current.ondataavailable = ({ data }: BlobEvent) => {
        if (data.size > 0) {
          setAudioChunks((prev) => [...prev, data]);
        }
        if (recordedTime >= maxDuration) {
          recorderRef.current?.stop();
        }
      };
      recorderRef.current.onerror = (event) => console.error(event);
      recorderRef.current.start(1000); // collect 1000ms of data
    }
  }, [audioStream, recordedTime, maxDuration]);

  const handleStop = useCallback(() => {
    console.log("STOP");

    if (recorderRef.current?.state === "recording") {
      recorderRef.current.requestData();
      recorderRef.current.stop();
    }

    setState("RECORDED");
    setStartTime(0);
  }, [recorderRef]);

  const handlePlay = useCallback(() => {
    console.log("PLAYING");
    setState("PLAYING");
    audioRef?.current?.play();
  }, []);

  const handlePause = useCallback(() => {
    console.log("PAUSED");
    setState("PAUSED");
    audioRef?.current?.pause();
  }, []);

  const handleReset = useCallback(() => {
    console.log("RESET");
    setState("IDLE");
    setStartTime(0);
    setRecordedTime(0);
    setAudioChunks([]);
    setFinalAudioBlob(undefined);
    enableAudioStream();
  }, [enableAudioStream]);

  const handleSave = useCallback(() => {
    console.log("SAVE");
    setState("SAVING");

    console.log(finalAudioBlob);

    if (!finalAudioBlob) {
      console.error("Error while saving audio: recorded audio is undefined.");
      return;
    }
  }, [finalAudioBlob]);

  const handleEnded = useCallback(() => {
    setState("PAUSED");
    setPlayedTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, []);

  const toolbarItems: ToolbarItem[] = [
    {
      type: "icon",
      name: "record",
      props: {
        icon: <Record color="" />,
        color: "danger",
        disabled: state !== "IDLE",
        onClick: handleRecord,
      },
    },
    {
      type: "icon",
      name: "stop",
      props: {
        icon: <RecordStop />,
        disabled: state !== "RECORDING",
        onClick: handleStop,
      },
    },
    {
      type: "icon",
      name: "play",
      visibility: state === "PLAYING" ? "hide" : "show",
      props: {
        icon: <PlayFilled />,
        disabled: state !== "RECORDED" && state !== "PAUSED",
        onClick: handlePlay,
      },
    },
    {
      type: "icon",
      name: "pause",
      visibility: state === "PLAYING" ? "show" : "hide",
      props: {
        icon: <Pause />,
        disabled: state !== "PLAYING",
        onClick: handlePause,
      },
    },
    { type: "divider" },
    {
      type: "icon",
      name: "reset",
      props: {
        icon: <Refresh />,
        disabled:
          state !== "RECORDED" && state !== "PLAYING" && state !== "PAUSED",
        onClick: handleReset,
      },
    },
    {
      type: "icon",
      name: "save",
      props: {
        icon: <Save />,
        disabled:
          state !== "RECORDED" && state !== "PLAYING" && state !== "PAUSED",
        onClick: handleSave,
      },
    },
  ];

  return {
    state,
    recordedTime,
    playedTime,
    maxDuration,
    audioRef,
    toolbarItems,
    handleEnded,
  };
}
