import {
  type App,
  type ResourceType,
  type IAction,
  type IFilter,
  type IOrder,
} from "edifice-ts-client";

export interface AppParams {
  app: App;
  types: ResourceType[];
  filters: IFilter[];
  orders: IOrder[];
  actions: IAction[];
  trashActions: IAction[];
  libraryAppFilter?: string;
}
