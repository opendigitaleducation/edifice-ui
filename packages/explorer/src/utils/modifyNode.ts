import { type TreeNode } from "@edifice-ui/react";

export function modifyNode(
  data: TreeNode,
  callback: (node: TreeNode, parent?: TreeNode) => TreeNode | undefined,
): TreeNode {
  // root cannot be undefined
  const root = doModify(data, callback) || data;
  return root;
}

function doModify(
  current: TreeNode,
  callback: (node: TreeNode, parent?: TreeNode) => TreeNode | undefined,
  parent?: TreeNode,
): TreeNode | undefined {
  const result = callback(current, parent);
  if (result?.children?.length) {
    const children: TreeNode[] = [];
    for (const child of result?.children || []) {
      const res = doModify(child, callback, result);
      if (res) {
        children.push(res);
      }
    }
    return { ...result!, children };
  }
  return result;
}
