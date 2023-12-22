import { type IResource } from "edifice-ts-client";

export function isResourceShared(resource: IResource) {
  const { rights, creatorId } = resource;
  const filteredRights = rights.filter((right) => !right.includes(creatorId));

  return filteredRights.length >= 1;
}
