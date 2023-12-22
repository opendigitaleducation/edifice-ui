import { type TreeNode } from "@edifice-ui/react";
import { type IFolder } from "edifice-ts-client";

import { modifyNode } from "./modifyNode";
import { TreeNodeFolderWrapper } from "~/features/Explorer/adapters";

export function updateNode(
  treeData: TreeNode,
  { folderId, newFolder }: { folderId: string; newFolder: IFolder },
): TreeNode {
  return modifyNode(treeData, (node) => {
    if (node.id === folderId) {
      return new TreeNodeFolderWrapper(newFolder);
    } else {
      return node;
    }
  });
}
