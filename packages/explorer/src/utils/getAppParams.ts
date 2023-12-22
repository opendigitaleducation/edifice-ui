import {
  APP,
  type App,
  type ResourceType,
  type IAction,
  type IFilter,
  type IOrder,
} from "edifice-ts-client";

const rootElement = document.querySelector<HTMLElement>("[data-ode-app]");
let _appParams: AppParams;
export function getAppParams(): AppParams {
  if (_appParams) {
    return _appParams;
  }
  _appParams = {
    app: APP.PORTAL,
    types: ["folder"],
    filters: [],
    actions: [],
    trashActions: [],
    orders: [],
  };
  if (rootElement?.dataset?.odeApp) {
    const { odeApp } = rootElement.dataset;
    // Inject params (JSON object or string) read from index.html in OdeProvider
    try {
      const p = JSON.parse(odeApp);
      Object.assign(_appParams, p);
    } catch (e) {
      console.error(
        "[AppParams] could not parse app params from root data attributes:",
        rootElement?.dataset,
        e,
      );
    }
  } else {
    console.error(
      "[AppParams] could not found app params from root data attributes:",
      rootElement?.dataset,
    );
  }
  return _appParams;
}

export interface AppParams {
  app: App;
  types: ResourceType[];
  filters: IFilter[];
  orders: IOrder[];
  actions: IAction[];
  trashActions: IAction[];
  libraryAppFilter?: string;
}
