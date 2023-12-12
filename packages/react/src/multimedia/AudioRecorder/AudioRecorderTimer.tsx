import { Mic, Pause, Record } from "@edifice-ui/icons";

import { PlayState, RecordState } from "./useAudioRecorder";
import { convertMsToMS } from "../../utils";

export interface AudioRecorderProps {
  recordState: RecordState;
  playState: PlayState;
  recordtime: number | undefined;
  audiotime: number | undefined;
}

const AudioRecorderTimer = ({
  recordState,
  playState,
  recordtime,
  audiotime,
}: AudioRecorderProps) => {
  return (
    <div className="audio-recorder-time m-16  mx-auto">
      {playState === "IDLE" && (
        <div className="d-flex align-items-center">
          {recordState === "PAUSED" ? (
            <Pause width={12} height={12} className="me-8 text-danger" />
          ) : (
            <Record width={12} height={12} className="me-8 text-danger" />
          )}
          {convertMsToMS(recordState !== "IDLE" ? recordtime! : 0)}
        </div>
      )}
      {playState !== "IDLE" && (
        <div className="d-flex align-items-center mx-auto">
          <Mic width={12} height={12} className="me-8" />
          {convertMsToMS(audiotime! * 1000)} /{convertMsToMS(recordtime!)}
        </div>
      )}
    </div>
  );
};

export default AudioRecorderTimer;
