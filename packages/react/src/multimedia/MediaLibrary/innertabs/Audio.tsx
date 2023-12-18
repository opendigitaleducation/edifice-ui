import { useRef } from "react";

import { AudioRecorder } from "../../AudioRecorder";
import { AudioRecorderRef } from "../../AudioRecorder/AudioRecorder";
import { useMediaLibraryContext } from "../MediaLibraryContext";

export const Audio = () => {
  const { setResult, setOnSuccessAction } = useMediaLibraryContext();
  const ref = useRef<AudioRecorderRef>(null);

  const handleOnUpdateRecord = (recordURL?: string) => {
    if (recordURL) {
      setResult(recordURL);
      setOnSuccessAction(() => ref.current!.save);
    } else {
      setResult();
    }
  };

  return (
    <AudioRecorder
      ref={ref}
      onRecordUpdated={handleOnUpdateRecord}
      hideSaveAction={true}
    ></AudioRecorder>
  );
};
