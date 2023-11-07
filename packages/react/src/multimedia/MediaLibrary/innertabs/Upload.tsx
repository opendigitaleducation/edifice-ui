import { useEffect } from "react";

import { WorkspaceElement } from "edifice-ts-client";

import Dropzone from "../../../components/Dropzone/Dropzone";
import { useDropzoneContext } from "../../../components/Dropzone/DropzoneContext";
import useHandleFile from "../../../core/useHandleFile/useHandleFile";
import { customSize } from "../../../utils/fileSize";
import UploadCard from "../../UploadCard/UploadCard";
import { MediaLibraryType } from "../MediaLibrary";
import { useMediaLibraryContext } from "../MediaLibraryContext";

const WorkspaceFiles = () => {
  const { files } = useDropzoneContext();
  const { status, saveFile } = useHandleFile();

  useEffect(() => {
    if (files) console.log({ files });
  }, [files]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const result = await saveFile(files[0]);

  //       if (result) console.log({ result });

  //       /* if (result) {
  //         setUploadFiles((prevFiles: any) => [...prevFiles, result]);
  //       } */
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return files.map((file) => {
    const fileInfo = {
      name: file?.name,
      info: {
        type: file?.type,
        weight: customSize(file?.size || 0, 1),
      },
      src: `/workspace/document/`,
    };
    return (
      <UploadCard
        key={file.name}
        status={status}
        //onDelete={() => handleDelete(uploadFile as WorkspaceElement, index)}
        onEdit={() => console.log("edit")}
        //onRetry={() => handleRetry()}
        item={fileInfo}
      />
    );
  });

  /* return (
    <UploadCard
      status={status}
      //onDelete={() => handleDelete(uploadFile as WorkspaceElement, index)}
      onEdit={() => console.log("edit")}
      //onRetry={() => handleRetry()}
      item={fileInfo}
    />
  ); */
};

export const Upload = () => {
  const { setResultCounter, setResult, type } = useMediaLibraryContext();

  const acceptTypeFile = (type: MediaLibraryType) => {
    const acceptTypes = [];

    switch (type) {
      case "audio":
      case "video":
        acceptTypes.push("video/mp4", "video/mp3");
        break;
      case "image":
        acceptTypes.push("image/jpeg", "image/png");
        break;
      default:
        break;
    }
    return acceptTypes;
  };

  const handleSuccess = (doc: WorkspaceElement[]) => {
    let result;

    if (doc.length === 0) {
      result = undefined;
      return;
    } else {
      result = doc;
    }

    setResult(result);
    setResultCounter(doc.length);
  };

  const handleError = (err: string) => {
    console.error(err);
  };

  return (
    <div className="py-8 flex-grow-1">
      <Dropzone
        multiple
        accept={acceptTypeFile(type ?? "embedder")}
        importMessage="Glissez-déposez un/des fichier(s) depuis votre appareil ou cliquez sur parcourir"
        onSuccess={handleSuccess}
        onError={handleError}
      >
        <WorkspaceFiles />
      </Dropzone>
    </div>
  );
};
