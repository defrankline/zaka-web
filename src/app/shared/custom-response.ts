export interface CustomResponse {
  message: string;
  data: any;
  other: any;
}

export enum DataState {
  LOADING_STATE = 'LOADING_STATE', LOADED_STATE = 'LOADED_STATE', ERROR_STATE = 'ERROR_STATE'
}

export interface AppState<T> {
  dataState: DataState;
  appData?: T;
  error?: string;
}
