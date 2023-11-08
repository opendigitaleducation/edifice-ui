import { WorkspaceElement } from "edifice-ts-client";

import Dropzone from "../../../components/Dropzone/Dropzone";
import { WorkspaceFilesList } from "../../WorkspaceFiles/WorkspaceFilesList";
import { MediaLibraryType } from "../MediaLibrary";
import { useMediaLibraryContext } from "../MediaLibraryContext";

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
        <WorkspaceFilesList />
      </Dropzone>
    </div>
  );
};
