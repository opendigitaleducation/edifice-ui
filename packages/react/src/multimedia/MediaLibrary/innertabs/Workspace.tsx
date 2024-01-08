import { Role, WorkspaceElement } from "edifice-ts-client";

import { Workspace as Component } from "../../Workspace";
import { useMediaLibraryContext } from "../MediaLibraryContext";

export const Workspace = () => {
  const { type, setResultCounter, setResult, setPreSuccess } =
    useMediaLibraryContext();

  function getDocumentRoleFilter(): Role | Role[] | null {
    switch (type) {
      case "image":
        return "img";
      case "audio":
        return "audio";
      case "video":
        return "video";
      default:
        return null; // = all document roles
    }
  }

  function handleSelect(result: WorkspaceElement[]) {
    setPreSuccess(undefined);
    setResultCounter(result.length);
    if (result.length) {
      setResult(result);
    } else {
      setResult();
    }
  }

  return (
    <Component
      roles={getDocumentRoleFilter()}
      onSelect={handleSelect}
      className="border rounded overflow-y-auto"
    ></Component>
  );
};
