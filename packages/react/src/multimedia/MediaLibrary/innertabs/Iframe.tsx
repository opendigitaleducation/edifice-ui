import { Embed } from "../../Embed";
import { useMediaLibraryContext } from "../MediaLibraryContext";

export const Iframe = () => {
  const { setResult, setPreSuccess } = useMediaLibraryContext();

  const handleOnSuccess = (ressource?: string) => {
    setPreSuccess(undefined);
    setResult(ressource);
  };

  return <Embed onSuccess={handleOnSuccess}></Embed>;
};
