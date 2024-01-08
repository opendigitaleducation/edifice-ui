import { type TreeNode } from "@edifice-ui/react";

export function findNodeById(id: string, data: TreeNode): TreeNode | undefined {
  let res: TreeNode | undefined;
  if (data?.id === id) {
    return data;
  }
  if (data?.children?.length) {
    data?.children?.every((childNode: TreeNode) => {
      res = findNodeById(id, childNode);
      return res === undefined; // break loop if res is found
    });
  }
  return res;
}
