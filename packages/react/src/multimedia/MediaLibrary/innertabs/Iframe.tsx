import { Embed } from "../../Embed";
import { useMediaLibraryContext } from "../MediaLibraryContext";

export const Iframe = () => {
  const { setResult } = useMediaLibraryContext();

  const handleOnSuccess = (ressource?: string) => {
    setResult(ressource);
  };

  return <Embed onSuccess={handleOnSuccess}></Embed>;
};
