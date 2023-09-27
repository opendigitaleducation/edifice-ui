import { useCallback, useReducer } from "react";

import { odeServices } from "edifice-ts-client";
import { ID, WorkspaceElement, WorkspaceSearchFilter } from "edifice-ts-client";

import { DocumentHelper, Role } from "./DocumentHelper";
import { TreeNode } from "../../components";
import { useMockedData } from "../OdeClientProvider";
import { useHasWorkflow } from "../useHasWorkflow";

export type FolderNode = TreeNode & { files?: WorkspaceElement[] };

/**
 * Utility function to find a node in a tree.
 */
function findById(node: TreeNode, nodeId?: string): FolderNode | undefined {
  if (!nodeId || node.id === nodeId) return node;
  return (
    Array.isArray(node.children) &&
    node.children.find((child) => findById(child, nodeId))
  );
}

export default function useWorkspaceSearch(
  rootId: string,
  rootName: string,
  filter: WorkspaceSearchFilter,
  format: Role | Role[] | null,
) {
  // Needed for storybook to mock calls to backend
  const mock = useMockedData();

  const canListDocs = useHasWorkflow(
    "org.entcore.workspace.controllers.WorkspaceController|listDocuments",
  );
  const canListFolders = useHasWorkflow(
    "org.entcore.workspace.controllers.WorkspaceController|listFolders",
  );

  /**
   * A workspace search maintains a tree of TreeNodes (which can be rendered in a TreeView),
   * starting at its `root`. Each node is a folder, with its sub-folders as children (also Treenodes)
   * and an array of contained `files` (WorkspaceElement[])
   */
  function treeReducer(
    state: FolderNode,
    action: {
      type: "update";
      folderId?: ID; // Can be undefined to target the root node
      subfolders: WorkspaceElement[];
      files: WorkspaceElement[];
    },
  ) {
    switch (action.type) {
      case "update": {
        const node = findById(state, action.folderId);
        if (node) {
          node.children = action.subfolders.map((f) => ({
            id: f._id || "",
            name: f.name,
          }));
          node.files = action.files;
        }
        return {
          ...state,
        };
      }
      default:
        throw Error("[useWorkspaceSearch] Unknown action type: " + action.type);
    }
  }

  const [root, dispatch] = useReducer(treeReducer, {
    id: rootId,
    name: rootName,
    section: true,
  });

  const loadContent = useCallback(
    (folderId?: ID) => {
      if (canListDocs && canListFolders) {
        const realWorkspaceId = folderId === rootId ? "" : folderId;
        // If mocked data is available, use it. Otherwise load from server.
        const asyncPayload =
          mock?.listWorkspaceDocuments?.().then((results) =>
            results.map((r) => {
              // Generate random IDs to prevent infinite recursion
              const ret = {
                ...r,
                _id: "" + Math.round(Math.random() * 9999),
              };
              ret.name =
                r.eType == "folder"
                  ? "folder id=" + ret._id
                  : "file id=" + ret._id;
              return ret;
            }),
          ) || odeServices.workspace().listDocuments(filter, realWorkspaceId);

        asyncPayload
          // Filter out elements of undesired role.
          .then((payload) =>
            payload.filter((f) => {
              if (!format || f.eType === "folder") return true;
              const role = DocumentHelper.getRole(f);
              if (typeof format === "string") return format === role;
              if (Array.isArray(format))
                return format.findIndex((r) => r === role) >= 0;
              return false; // should not happen
            }),
          )
          .then((content) => {
            // Split results between folders and files :
            const subfolders: WorkspaceElement[] = [];
            const files: WorkspaceElement[] = [];
            content.forEach((doc) => {
              if (doc.eType === "folder") {
                subfolders.push(doc);
              } else {
                files.push(doc);
              }
            });
            const newValue = { folderId: folderId, subfolders, files };
            dispatch({ ...newValue, type: "update" });
          });
      }
    },
    [canListDocs, canListFolders, rootId, mock, filter, format],
  );

  return { root, loadContent } as {
    root: FolderNode;
    loadContent: (folderId?: ID) => void;
  };
}
