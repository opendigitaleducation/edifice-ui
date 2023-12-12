import { Mic, Pause, Record } from "@edifice-ui/icons";

import { PlayState, RecordState } from "./useAudioRecorder";
import { convertMsToMS } from "../../utils";

export interface AudioRecorderProps {
  recordState: RecordState;
  playState: PlayState;
  recordTime: number | undefined;
  audioTime: number;
}

const AudioRecorderTimer = ({
  recordState,
  playState,
  recordTime,
  audioTime,
}: AudioRecorderProps) => {
  return (
    <div className="audio-recorder-time my-16 mx-auto">
      {playState === "IDLE" && (
        <div className="d-flex align-items-center">
          {recordState === "PAUSED" ? (
            <Pause width={12} height={12} className="me-8 text-danger" />
          ) : (
            <Record width={12} height={12} className="me-8 text-danger" />
          )}
          {convertMsToMS(recordState !== "IDLE" ? recordTime! : 0)}
        </div>
      )}
      {playState !== "IDLE" && (
        <div className="d-flex align-items-center">
          <Mic width={12} height={12} className="me-8" />
          {audioTime} /{convertMsToMS(recordTime!)}
        </div>
      )}
    </div>
  );
};

export default AudioRecorderTimer;
