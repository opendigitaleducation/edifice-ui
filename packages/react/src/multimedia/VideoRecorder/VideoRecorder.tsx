/* eslint-disable react-hooks/exhaustive-deps */
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  Pause,
  PlayFilled,
  Record,
  RecordStop,
  RecordVideo,
  Refresh,
  Save,
} from "@edifice-ui/icons";
import { WorkspaceElement, odeServices } from "edifice-ts-client";
import { VideoUploadParams } from "edifice-ts-client/dist/video/interface";
import { useTranslation } from "react-i18next";

import {
  FormControl,
  Label,
  LoadingScreen,
  OptionsType,
  Select,
} from "../../components";
import { Toolbar, ToolbarItem } from "../../components/Toolbar";
import useBrowserInfo from "../../hooks/useBrowserInfo/useBrowserInfo";
import { convertMsToMS, getBestSupportedMimeType } from "../../utils";

export interface VideoRecorderProps {
  appCode: string;
  caption?: string;
  onSuccess?: (res: WorkspaceElement[]) => void;
  onError: (error: string) => void;
  onRecordUpdated?: (recordURL?: string) => void;
  hideSaveAction?: boolean;
}

const VIDEO_HEIGHT = 455;
const VIDEO_WIDTH = 728;

export interface VideoRecorderRef {
  save: () => Promise<WorkspaceElement | undefined>;
}

const VideoRecorder = forwardRef(
  (
    {
      appCode,
      caption,
      onSuccess,
      onError,
      onRecordUpdated,
      hideSaveAction = false,
    }: VideoRecorderProps,
    ref,
  ) => {
    const [maxDuration, setMaxDuration] = useState<number>(180000);
    const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);

    const [recording, setRecording] = useState<boolean>(false);
    const [recorded, setRecorded] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [saved, setSaved] = useState<boolean>(false);

    const [mediaStreamConstraints, setMediaStreamConstraints] =
      useState<MediaStreamConstraints>({
        audio: true,
        video: {
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT,
          facingMode: "environment",
        },
      });
    const [stream, setStream] = useState<MediaStream>();
    const [mimeType, setMimeType] = useState<string>("");

    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [recordedVideo, setRecordedVideo] = useState<Blob>();

    const [startTime, setStartTime] = useState<number>(0);
    const [recordedTime, setRecordedTime] = useState<number>(0);
    const [playedTime, setPlayedTime] = useState<number>(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);

    const { browser, device } = useBrowserInfo(navigator.userAgent);

    // We add one methods to handle save action from parent component
    useImperativeHandle(ref, () => ({
      save: handleSave,
    }));

    const { t } = useTranslation();

    /**
     * Get max duration from Conf and input devices list.
     */
    useEffect(() => {
      initMaxDuration();
      initInputDevices();
    }, []);

    /**
     * Enable video stream and stop streaming on clean up.
     */
    useEffect(() => {
      if (!stream) {
        enableStream(mediaStreamConstraints);
      }
      return () => {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }, [stream]);

    /**
     * Get last updated recorded chunk and set the recorded video as source for user to watch it.
     */
    useEffect(() => {
      if (recordedChunks.length && !recording && videoRef.current) {
        const finalVideo: Blob = new Blob(recordedChunks, { type: mimeType });
        setRecordedVideo(finalVideo);

        if (onRecordUpdated) {
          const videoUrl = window.URL.createObjectURL(finalVideo);
          onRecordUpdated(videoUrl);
        }
        videoRef.current.autoplay = false;
        videoRef.current.srcObject = null;
        videoRef.current.src = window.URL.createObjectURL(finalVideo);
      }
    }, [recording, recordedChunks]);

    /**
     * Handle recording countup.
     */
    useEffect(() => {
      const timer = window.setInterval(() => {
        setRecordedTime((prev) => {
          if (recording) {
            return prev + 500; // add 500ms
          }
          return prev;
        });
      }, 500);

      return () => {
        window.clearInterval(timer);
      };
    }, [startTime, recording]);

    /**
     * Handle playing countup.
     */
    useEffect(() => {
      const timer = window.setInterval(() => {
        setPlayedTime((prev) => {
          if (playing) {
            return prev + 500; // add 500ms
          }
          return prev;
        });
      }, 500);

      return () => {
        window.clearInterval(timer);
      };
    }, [startTime, playing]);

    const initMaxDuration = async () => {
      const videoConfResponse = await odeServices.video().getVideoConf();
      setMaxDuration(videoConfResponse.maxDuration * 60 * 1000);
    };

    const initInputDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput",
      );
      // console, mobile, tablet, smarttv, wearable, embedded
      switch (device.type) {
        case "mobile":
        case "tablet": {
          const backCamera = {
            deviceId: "environment",
            label: t("video.back.camera"),
            groupId: "",
            kind: "videoinput",
          } as MediaDeviceInfo;
          const frontCamera = {
            deviceId: "user",
            label: t("video.front.camera"),
            groupId: "",
            kind: "videoinput",
          } as MediaDeviceInfo;

          if (videoDevices?.length > 1) {
            // mobile/tablet has more than 1 camera
            setInputDevices([backCamera, frontCamera]);
          } else {
            // else we let the system use the only one that exists (or none)
            setInputDevices([backCamera]);
          }
          break;
        }
        default:
          // "Desktop" or other future types => list all cameras without distinction.
          setInputDevices(videoDevices);
          break;
      }
    };

    const enableStream = async (
      mediaStreamConstraints: MediaStreamConstraints,
    ) => {
      try {
        const mediaStream: MediaStream =
          await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
        setStream(mediaStream);

        if (videoRef.current) {
          if (videoRef.current.src) {
            window.URL.revokeObjectURL(videoRef.current.src);
          }
          videoRef.current.srcObject = mediaStream;
          videoRef.current.autoplay = true;
          videoRef.current.volume = 1;
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleRecord = useCallback(() => {
      setStartTime(Date.now());
      setRecording(true);

      if (videoRef && videoRef.current) {
        videoRef.current.muted = true;
      }

      const mimeType = getBestSupportedMimeType();
      setMimeType(mimeType);

      if (stream) {
        recorderRef.current = new MediaRecorder(stream, { mimeType });
        recorderRef.current.ondataavailable = ({ data }: BlobEvent) => {
          if (data.size > 0) {
            setRecordedChunks((prev) => [...prev, data]);
          }
          if (recordedTime >= maxDuration) {
            recorderRef?.current?.stop();
          }
        };
        recorderRef.current.onerror = (event) => console.error(event);
        recorderRef.current.start(1000); // collect 1000ms of data
      }
    }, [stream]);

    const handleStop = useCallback(() => {
      setRecording(false);
      setRecorded(true);

      if (recorderRef.current?.state === "recording") {
        recorderRef.current.requestData();
        recorderRef.current.stop();
      }

      setStartTime(0);
    }, [recorderRef]);

    const handlePlayPause = useCallback(() => {
      if (videoRef && videoRef.current) {
        videoRef.current.muted = false;
      }

      if (!playing) {
        videoRef?.current?.play();
        setPlaying(true);
      } else {
        videoRef?.current?.pause();
        setPlaying(false);
      }
    }, [playing]);

    const handleReset = () => {
      setRecorded(false);
      setRecording(false);
      setPlaying(false);
      setSaved(false);
      setStartTime(0);
      setRecordedTime(0);
      setRecordedChunks([]);
      setRecordedVideo(undefined);
      enableStream(mediaStreamConstraints);

      if (onRecordUpdated) {
        onRecordUpdated();
      }
    };

    const handleSave = async () => {
      setSaving(true);
      if (!recordedVideo) {
        console.error("Error while saving video: recorded video is undefined.");
        return;
      }

      const params: VideoUploadParams = {
        data: {
          device: device.type,
          browser: { name: browser.name, version: browser.version },
          url: window.location.hostname,
          file: recordedVideo,
          filename: "filename",
          weight: recordedVideo.size,
        },
        appCode: appCode,
        captation: true,
        duration: recordedTime,
      };

      const uploadResponse = await odeServices.video().upload(params);
      if (uploadResponse.state === "succeed") {
        await odeServices
          .video()
          .generateSaveEvent(
            appCode,
            recordedTime,
            { name: browser.name, version: browser.version },
            device.type,
            uploadResponse,
          );

        const resVideo: WorkspaceElement = {
          _id: uploadResponse.videoworkspaceid,
          file: uploadResponse.videoid,
          name: params.data.filename,
          eType: "file",
          eParent: "",
          children: [],
          created: new Date(),
          _shared: [],
          _isShared: false,
          owner: { userId: "", displayName: "" },
        };

        onSuccess?.([resVideo]);
        setSaving(false);
        setSaved(true);
        return [resVideo];
      } else if (uploadResponse.state === "error") {
        onError("Error while uploading video");
      } else {
        console.info("Video encoding is still running");
      }
      setSaving(false);
      setSaved(true);
    };

    const handleEnded = () => {
      setPlaying(false);
      setPlayedTime(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    };

    const handleInputDeviceChange = (option: OptionsType | string) => {
      const selectedDevice = inputDevices.find(
        (inputDevice) => inputDevice.label === option,
      );

      let mediaStreamConstraints: MediaStreamConstraints = {};
      if (selectedDevice?.deviceId) {
        if (
          selectedDevice?.deviceId === "environment" ||
          selectedDevice?.deviceId === "user"
        ) {
          mediaStreamConstraints = {
            audio: true,
            video: {
              width: VIDEO_WIDTH,
              height: VIDEO_HEIGHT,
              facingMode: selectedDevice?.deviceId,
            },
          };
        } else {
          mediaStreamConstraints = {
            audio: true,
            video: {
              width: VIDEO_WIDTH,
              height: VIDEO_HEIGHT,
              deviceId: selectedDevice.deviceId,
            },
          };
        }

        setMediaStreamConstraints(mediaStreamConstraints);

        if (stream) {
          if (recorderRef.current?.state === "recording") {
            recorderRef.current.requestData();
            recorderRef.current.stop();
          }
          stream.getTracks().forEach((track) => track.stop());
          setStream(undefined);
        }
        enableStream(mediaStreamConstraints);
      } else {
        console.error("Selected input device id is null");
      }
    };

    const toolbarItems: ToolbarItem[] = [
      {
        type: "icon",
        name: "record",
        props: {
          icon: <Record color={recording || recorded ? "" : "red"} />,
          color: "danger",
          disabled: recording || recorded || saving,
          onClick: handleRecord,
        },
      },
      {
        type: "icon",
        name: "stop",
        props: {
          icon: <RecordStop />,
          disabled: !recording || recorded || saving,
          onClick: handleStop,
        },
      },
      {
        type: "icon",
        name: "play",
        visibility: !playing ? "show" : "hide",
        props: {
          icon: <PlayFilled />,
          disabled: !recorded || saving,
          onClick: handlePlayPause,
        },
      },
      {
        type: "icon",
        name: "pause",
        visibility: playing ? "show" : "hide",
        props: {
          icon: <Pause />,
          disabled: !recorded || saving,
          onClick: handlePlayPause,
        },
      },
      { type: "divider" },
      {
        type: "icon",
        name: "reset",
        props: {
          icon: <Refresh />,
          disabled: !recorded || saving,
          onClick: handleReset,
        },
      },
      {
        type: "icon",
        name: "save",
        visibility: hideSaveAction ? "hide" : "show",
        props: {
          icon: <Save />,
          disabled: !recorded || saving || saved,
          onClick: handleSave,
        },
      },
    ];

    return (
      <div className="video-recorder d-flex flex-fill flex-column align-items-center">
        <div className="video-recorder-caption m-12">{caption}</div>
        {inputDevices.length > 1 && (
          <div className="video-recorder-devices mb-12">
            <FormControl id="selectInputDevice">
              <Label>{t("video.select.devices.label")}</Label>
              <Select
                placeholderOption={t("video.select.devices.placeholder")}
                options={inputDevices.map(
                  (videoInputDevice) => videoInputDevice.label,
                )}
                onValueChange={handleInputDeviceChange}
              />
            </FormControl>
          </div>
        )}
        <div className="video-recorder-video position-relative">
          <video
            ref={videoRef}
            playsInline={true}
            autoPlay={true}
            controls={false}
            muted={true}
            height={VIDEO_HEIGHT}
            width={VIDEO_WIDTH}
            onEnded={handleEnded}
            className="rounded"
          >
            <track default kind="captions" srcLang="fr" src=""></track>
          </video>
          {(recording || recorded) && (
            <div className="video-recorder-time d-flex align-items-center position-absolute top-0 py-2 px-8 font-monospace fs-6 text-bg-dark rounded">
              {recording && (
                <>
                  <Record width={12} height={12} color="red" className="me-4" />
                  <span>
                    {convertMsToMS(recordedTime)}/{convertMsToMS(maxDuration)}
                  </span>
                </>
              )}
              {recorded && (
                <>
                  <RecordVideo width={14} height={14} className="me-4" />
                  <span>
                    {convertMsToMS(playedTime)}/{convertMsToMS(recordedTime)}
                  </span>
                </>
              )}
            </div>
          )}
          <Toolbar
            items={toolbarItems}
            className="position-absolute bottom-0 start-50 translate-middle bg-white"
          />
        </div>
        {saving && (
          <LoadingScreen
            position={false}
            caption={t("video.save.loader.caption")}
          />
        )}
      </div>
    );
  },
);

export default VideoRecorder;
