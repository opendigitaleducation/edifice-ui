import { type TreeNode } from "@edifice-ui/react";
import { type IFolder } from "edifice-ts-client";

import { arrayUnique } from "./arrayUnique";
import { modifyNode } from "./modifyNode";
import { TreeNodeFolderWrapper } from "~/features/Explorer/adapters";

export function addNode(
  treeData: TreeNode,
  { parentId, newFolder }: { parentId: string; newFolder: IFolder },
): TreeNode {
  return modifyNode(treeData, (node) => {
    if (node.id === parentId) {
      const parentAncestors = [
        ...((node as TreeNodeFolderWrapper).folder?.ancestors || []),
      ];
      const ancestors = arrayUnique([...parentAncestors, node.id]);
      const newNode: TreeNode = {
        ...node,
        children: [
          ...(node.children || []),
          new TreeNodeFolderWrapper({ ...newFolder, ancestors }),
        ],
      };
      return newNode;
    } else {
      return node;
    }
  });
}
