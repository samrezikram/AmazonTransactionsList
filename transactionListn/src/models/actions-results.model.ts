import { Subject } from 'rxjs';

import { GlobalActionsTypes, AppActionsTypes, ThemesActionsTypes } from '@enums/actions-types.enum';
import { IAppState, IThemeState } from './app/global-state.model';
import { ITransactionJSON, ITransaction } from './app/transaction-json.model';


// Global ------------------------------------------------------------------------------------------------------
// Actions ---------------
export interface IGlobalActionResult {
  type: GlobalActionsTypes;
}
// -------------------------------------------------------------------------------------------------------------

// App ---------------------------------------------------------------------------------------------------------
// Actions ---------------
export interface IAppActionResult {
  type: AppActionsTypes;
  payload: IAppState;
}

// Sagas -----------------
// ----------
export interface IAmazonTransactionSagaTriggerObject extends ISagaTriggerObject {
  _observable: Subject<boolean>;
  promise: Promise<boolean>;
  payload: {
    clearPreviousTransactionItems?: boolean;
    offset?: number;
  }
}

export interface ITransactionGroup {
  date: string;
  data: ITransaction[];
}

// -------------------------------------------------------------------------------------------------------------

// Themes ------------------------------------------------------------------------------------------------------
// Actions ---------------
export interface IThemeActionResult {
  type: ThemesActionsTypes;
  payload: IThemeState;
}

// Saga Trigger ------------------------------------------------------------------------------------------------
export interface ISagaTriggerObject {
  type: GlobalActionsTypes | AppActionsTypes | ThemesActionsTypes;
  showErrorAlerts?: boolean;
  onErrorAlertDismissal?: () => void;
}
// -------------------------------------------------------------------------------------------------------------
