import {
  FormEvent,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Filter, Search } from "@edifice-ui/icons";
import { WorkspaceElement, WorkspaceSearchFilter } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import {
  Dropdown,
  DropdownTrigger,
  FormControl,
  Grid,
  Input,
  SearchButton,
  TreeNode,
  TreeView,
  TreeViewHandlers,
} from "../../components";
import { Role, useWorkspaceSearch } from "../../core";
import { FolderNode } from "../../core/useWorkspaceSearch/useWorkspaceSearch";

/**
 * MediaLibrary component properties
 */
export interface WorkspaceProps {
  /**
   * Only display media elements having this role[s] (=generic file format).
   * Set to null to display all medias.
   */
  roles: Role | Role[] | null;
  /** Notify parent when media elements are successfully selected. */
  onSelect: (result: WorkspaceElement[]) => void;
}

export const Workspace = (props: WorkspaceProps) => {
  const { t } = useTranslation();
  const inputRef: Ref<HTMLInputElement> = useRef(null);

  const { root: owner, loadContent: loadOwnerDocs } = useWorkspaceSearch(
    "owner",
    t("Mes documents"),
    "owner",
    props.roles,
  );
  const { root: shared, loadContent: loadSharedDocs } = useWorkspaceSearch(
    "shared",
    t("Partagé avec moi"),
    "shared",
    props.roles,
  );
  const { root: protect, loadContent: loadProtectedDocs } = useWorkspaceSearch(
    "protected",
    t("Ajouté dans les applications"),
    "protected",
    props.roles,
  );

  const ownerRef = useRef<TreeViewHandlers>(null);
  const sharedRef = useRef<TreeViewHandlers>(null);
  const protectRef = useRef<TreeViewHandlers>(null);

  /**
   * Retrieve the stateful TreeNode matching a WorkspaceSearchFilter value
   */
  const rootNodeFor: (filter: WorkspaceSearchFilter) => {
    root: FolderNode;
    othersRef: React.RefObject<TreeViewHandlers>[];
  } = useCallback(
    (filter: WorkspaceSearchFilter) => {
      switch (filter) {
        case "owner":
          return { root: owner, othersRef: [sharedRef, protectRef] };
        case "shared":
          return { root: shared, othersRef: [ownerRef, protectRef] };
        case "protected":
          return { root: protect, othersRef: [ownerRef, sharedRef] };
        default:
          throw "no.root.node";
      }
    },
    [owner, protect, shared],
  );

  const [currentFilter, setCurrentFilter] =
    useState<WorkspaceSearchFilter>("owner");

  const [currentNode, setCurrentNode] = useState<FolderNode>(owner);

  const [documents, setDocuments] = useState<WorkspaceElement[]>([]);

  const [searchTerm, setSearchTerm] = useState<string | undefined>(null!);

  const [selectedDocuments, setSelectedDocuments] = useState<
    WorkspaceElement[]
  >([]);

  /**
   * Load current node children (folders and files)
   */
  const loadContent = useCallback(() => {
    // Try to avoid loading twice
    if (
      typeof currentNode.children === "undefined" ||
      !currentNode.children.length
    ) {
      switch (currentFilter) {
        case "owner":
          loadOwnerDocs(currentNode.id);
          break;
        case "shared":
          loadSharedDocs(currentNode.id);
          break;
        case "protected":
          loadProtectedDocs(currentNode.id);
          break;
        default:
          throw "no.way";
      }
    }
  }, [
    currentFilter,
    currentNode,
    loadOwnerDocs,
    loadProtectedDocs,
    loadSharedDocs,
  ]);

  /**
   * Utility function to find a node in a tree.
   */
  function find(
    root: TreeNode,
    predicate: (node: TreeNode) => boolean,
  ): TreeNode | undefined {
    if (predicate(root)) return root;
    return (
      Array.isArray(root.children) &&
      root.children.find((child) => find(child, predicate))
    );
  }

  function selectAndLoadContent(filter: WorkspaceSearchFilter, nodeId: string) {
    setCurrentFilter(filter);
    const { root, othersRef } = rootNodeFor(filter);
    const targetNode = find(root, (node) => node.id === nodeId);
    if (targetNode) {
      setCurrentNode(targetNode);
      // Reset others current selection, if any
      othersRef.forEach((otherRef) => otherRef.current?.unselectAll());
    }
  }

  /** Load content when the callback is updated */
  useEffect(loadContent, [loadContent]);

  /** Display documents when currentNode or searchTerm changes */
  useEffect(() => {
    let list = currentNode.files || [];
    if (searchTerm) {
      list = list.filter((f) => f.name.indexOf(searchTerm) >= 0);
    }
    setDocuments(list);
  }, [currentNode, owner, protect, shared, searchTerm]);

  /** Load initial content, once */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => selectAndLoadContent("owner", "owner"), []);

  const handleSearchSubmit = useCallback(
    (e: FormEvent) => {
      setSearchTerm(inputRef.current?.value);
      e.stopPropagation();
      e.preventDefault();
    },
    [inputRef],
  );

  const handleToggleDocSelect = (doc: WorkspaceElement) => {
    const idx = selectedDocuments.findIndex((d) => d._id === doc._id);
    if (idx < 0) {
      selectedDocuments.push(doc);
    } else {
      selectedDocuments.splice(idx, 1);
    }
    setSelectedDocuments([...selectedDocuments]);
    props.onSelect(selectedDocuments);
  };

  return (
    <Grid className="workspace flex-grow-1 gap-0">
      <Grid.Col sm="1" md="3" xl="4" className="folders border-end p-12 gap-12">
        <TreeView
          ref={ownerRef}
          data={owner}
          onTreeItemSelect={(nodeId) => selectAndLoadContent("owner", nodeId)}
          onTreeItemUnfold={(nodeId) => selectAndLoadContent("owner", nodeId)}
        />
        <TreeView
          ref={sharedRef}
          data={shared}
          onTreeItemSelect={(nodeId) => selectAndLoadContent("shared", nodeId)}
          onTreeItemUnfold={(nodeId) => selectAndLoadContent("shared", nodeId)}
        />
        <TreeView
          ref={protectRef}
          data={protect}
          onTreeItemSelect={(nodeId) =>
            selectAndLoadContent("protected", nodeId)
          }
          onTreeItemUnfold={(nodeId) =>
            selectAndLoadContent("protected", nodeId)
          }
        />
      </Grid.Col>
      <Grid.Col sm="3" md="5" xl="8">
        <Grid className="flex-grow-1 gap-0">
          <Grid.Col
            sm="4"
            md="8"
            xl="12"
            className="search border-bottom px-16 py-8 "
          >
            <form className="gap-16 d-flex" onSubmit={handleSearchSubmit}>
              <FormControl className="input-group" id="search">
                <Input
                  noValidationIcon
                  ref={inputRef}
                  placeholder={t("Placeholder text")}
                  size="md"
                  type="search"
                />
                <SearchButton
                  aria-label={t("Rechercher")}
                  icon={<Search />}
                  type="submit"
                />
              </FormControl>

              <Dropdown
                trigger={
                  <DropdownTrigger icon={<Filter />} title={t("Filtrer")} />
                }
                content={<p>TODO</p>}
              />
            </form>
          </Grid.Col>
          <Grid.Col sm="4" md="8" xl="12" className="list p-12 gap-8">
            <ul>
              {documents.map((doc) => (
                <li>
                  <p>
                    {doc.name}, {doc.ownerName}
                  </p>
                  <button onClick={() => handleToggleDocSelect(doc)}>
                    Select
                  </button>
                </li>
              ))}
            </ul>
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
  );
};
export default Workspace;