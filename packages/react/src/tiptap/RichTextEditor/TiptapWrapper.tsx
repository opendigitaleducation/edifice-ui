import { ReactNode } from "react";

const TiptapWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="border rounded">{children}</div>;
};

export default TiptapWrapper;
