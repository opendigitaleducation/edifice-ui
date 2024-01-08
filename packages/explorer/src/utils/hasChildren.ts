import { type TreeNode } from "@edifice-ui/react";

export function hasChildren(folderId: string, data: TreeNode): boolean {
  if (data.id === folderId && data.children) {
    return data.children.length > 0;
  }

  if (data.children) {
    return data.children.some((child: TreeNode) => hasChildren(data.id, child));
  }
  return false;
}
