export interface Card {
  id: string;
  name: string;
  thumbnail: string;
}

export interface TreeNode {
  id: string;
  name: string;
  section?: boolean;
  children?: readonly TreeNode[];
}
