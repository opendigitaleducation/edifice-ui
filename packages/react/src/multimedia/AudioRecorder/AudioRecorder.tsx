import { Mic } from "@edifice-ui/icons";
import { WorkspaceElement } from "edifice-ts-client";

import useAudioRecorder from "./useAudioRecorder";
import { FormControl, Input, Toolbar } from "../../components";
import { convertMsToMS } from "../../utils";

export interface AudioRecorderProps {
  onSuccess: (res: WorkspaceElement) => void;
  onError: (error: string) => void;
}

const AudioRecorder = () => {
  function handleAudioSaved(audioFileBlob: Blob, audioFileName: string) {
    const finalAudioFile = new FormData();
    // set `blob` name
    finalAudioFile.append("file", audioFileBlob!, audioFileName);

    console.log(finalAudioFile.get("file"));
  }

  const {
    recordState,
    playState,
    recordedTime,
    playedTime,
    maxDuration,
    audioRef,
    toolbarItems,
    audioNameRef,
    handleEnded,
  } = useAudioRecorder(handleAudioSaved);

  return (
    <div className="audio-recorder d-flex flex-column align-items-center">
      <div className="audio-recorder-icon">
        <Mic
          width={64}
          height={64}
          style={
            recordState === "RECORDING"
              ? { color: "var(--edifice-danger)" }
              : playState === "PLAYING"
              ? { color: "var(--edifice-success)" }
              : {}
          }
        />
      </div>
      <div className="audio-recorder-time m-16">
        {(recordState === "RECORDING" ||
          recordState === "PAUSED" ||
          recordState === "IDLE") &&
          playState === "IDLE" &&
          `${convertMsToMS(recordedTime)} / ${convertMsToMS(maxDuration)}`}
        {(recordState === "RECORDED" ||
          playState === "PLAYING" ||
          playState === "PAUSED") &&
          recordState !== "RECORDING" &&
          `${convertMsToMS(playedTime)} / ${convertMsToMS(recordedTime)}`}
      </div>
      <div>
        <audio ref={audioRef} onEnded={handleEnded}>
          <track default kind="captions" srcLang="fr" src=""></track>
        </audio>
      </div>
      <div className="audio-recorder-toolbar toolbar default">
        <FormControl id="recordName" className="mb-8">
          <Input
            type="text"
            size={"sm"}
            ref={audioNameRef}
            defaultValue={"Capture " + new Date().toLocaleDateString()}
          />
        </FormControl>
        <Toolbar items={toolbarItems} variant="no-shadow" />
      </div>
    </div>
  );
};

export default AudioRecorder;
