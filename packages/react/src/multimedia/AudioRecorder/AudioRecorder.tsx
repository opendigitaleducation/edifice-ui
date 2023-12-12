import { useState } from "react";

import { Mic } from "@edifice-ui/icons";
import clsx from "clsx";
import { WorkspaceElement } from "edifice-ts-client";

import AudioRecorderTimer from "./AudioRecorderTimer";
import useAudioRecorder from "./useAudioRecorder";
import { FormControl, Input, Toolbar } from "../../components";
import { convertMsToMS } from "../../utils";

export interface AudioRecorderProps {
  onSuccess: (resource: WorkspaceElement) => void;
  onError: (error: string) => void;
}

const AudioRecorder = ({ onSuccess, onError }: AudioRecorderProps) => {
  const {
    recordState,
    playState,
    recordtime,
    audioRef,
    audioNameRef,
    toolbarItems,
    handlePlayEnded,
  } = useAudioRecorder(onSuccess, onError);

  const [audioTime, setAudioTime] = useState<string>();

  const classColor = clsx({
    "text-danger": recordState === "RECORDING",
    "text-success": playState === "PLAYING",
  });

  const handleTimeUpdate = (event: any) => {
    setAudioTime(convertMsToMS(event.target.currentTime! * 1000));
  };

  return (
    <div className="audio-recorder m-auto d-flex flex-column">
      <FormControl
        id="recordName"
        className="mb-32"
        isRequired
        isReadOnly={recordState === "SAVED" || recordState === "SAVING"}
      >
        <Input
          type="text"
          size={"sm"}
          placeholder="Nom de l'enregistrement audio"
          ref={audioNameRef}
          defaultValue={"Capture " + new Date().toLocaleDateString()}
        />
      </FormControl>
      <div className="audio-recorder-icon mx-auto ">
        <Mic width={64} height={64} className={classColor} />
      </div>
      <AudioRecorderTimer
        recordState={recordState}
        playState={playState}
        recordTime={recordtime}
        audioTime={audioTime}
      ></AudioRecorderTimer>
      <audio
        ref={audioRef}
        onEnded={handlePlayEnded}
        onTimeUpdate={handleTimeUpdate}
      >
        <track default kind="captions" srcLang="fr" src=""></track>
      </audio>
      <Toolbar items={toolbarItems} />
    </div>
  );
};

export default AudioRecorder;
