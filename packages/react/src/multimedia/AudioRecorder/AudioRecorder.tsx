import { Mic } from "@edifice-ui/icons";
import { WorkspaceElement } from "edifice-ts-client";

import useAudioRecorder from "./useAudioRecorder";
import { Toolbar } from "../../components";
import { convertMsToMS } from "../../utils";

export interface AudioRecorderProps {
  onSuccess: (res: WorkspaceElement) => void;
  onError: (error: string) => void;
}

const AudioRecorder = () => {
  const {
    state,
    recordedTime,
    playedTime,
    maxDuration,
    audioRef,
    toolbarItems,
    handleEnded,
  } = useAudioRecorder();

  return (
    <div className="audio-recorder d-flex flex-column align-items-center">
      <div className="audio-recorder-icon">
        <Mic width={64} height={64} />
      </div>
      <div className="audio-recorder-time m-16">
        {(state === "RECORDING" || state === "IDLE") &&
          `${convertMsToMS(recordedTime)} / ${convertMsToMS(maxDuration)}`}
        {(state === "RECORDED" || state === "PLAYING" || state === "PAUSED") &&
          `${convertMsToMS(playedTime)} / ${convertMsToMS(recordedTime)}`}
      </div>
      <div>
        <audio ref={audioRef} onEnded={handleEnded}>
          <track default kind="captions" srcLang="fr" src=""></track>
        </audio>
      </div>
      <div className="audio-recorder-toolbar">
        <Toolbar items={toolbarItems} />
      </div>
    </div>
  );
};

export default AudioRecorder;
