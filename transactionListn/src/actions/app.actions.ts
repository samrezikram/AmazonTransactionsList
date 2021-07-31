import { Subject } from 'rxjs';

import { AppActionsTypes } from '@enums/actions-types.enum';

import {
  IAppActionResult,
  ITransactionGroup,
  IAmazonTransactionSagaTriggerObject,
  ISagaTriggerObject,
} from '@models/actions-results.model';
import { ITransactionJSON, ITransaction } from './../models/app/transaction-json.model';
import { IAmazonTransactionRequest } from '@models/http/transaction.model';


//  @description This should only be called by a saga, not directly from a component

/* ------------------------------------------------------------------ */
/* ---------------------    Actions    ------------------------------ */
/* ------------------------------------------------------------------ */
/**
 *
 * @description This should only be called by a saga, not directly from a component
 */
export function _setDoneInitializingApp(done: boolean): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_DONE_INITIALIZING_APP,
    payload: {
      doneInitializing: done
    }
  };
  return result;
}
// ----------------------

export function _setIsLoadingAmazonTransactionItems(_isLoadingTransactionItems: boolean): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_IS_LOADING_TRANSACTION_ITEMS,
    payload: {
      isLoadingTransactionItems: _isLoadingTransactionItems
    }
  };
  return result;
}
// ----------------------

export function _setTotalAmazonTransactionCount(count: number): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_TOTAL_TRANSACTION_COUNT,
    payload: {
      totalCount: count,
    }
  };
  return result;
}
// ----------------------

export function _setAmazonTransactionItems(_transactionItems: ITransaction[]): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_TRANSACTION_ITEMS,
    payload: {
      transactionItems: _transactionItems
    }
  };
  return result;
}
// ----------------------

export function _setAmazonTransactionGroups(_transactionsGroups: ITransactionGroup[]): IAppActionResult {
  const result: IAppActionResult = {
  type: AppActionsTypes.SET_TRANSACTION_GROUPS,
    payload: {
      transactionGroups: _transactionsGroups
    }
  };
  return result;
}
// ----------------------

export function _setAmazonTransactionLoadingError(error: string): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_TRANSACTION_LOADING_ERROR,
    payload: {
      transactionLoadingError: error
    }
  };
  return result;
}
// ----------------------

/* ------------------------------------------------------------------ */
/* ------------------    Saga Triggers    --------------------------- */
/* ------------------------------------------------------------------ */
export function loadAmazonTransactionItemsAsync(_clearPreviousTransactionItems?: boolean, _offset?: number, showErrorAlerts?: boolean, onErrorAlertDismissal?: () => void): IAmazonTransactionSagaTriggerObject {
  const _observable: Subject<boolean> = new Subject<boolean>();
  const result: IAmazonTransactionSagaTriggerObject = {
    type: AppActionsTypes.LOAD_AMAZON_TRANSACTION_LIST_SAGA,
    _observable: _observable,
    promise: _observable.toPromise(),
    payload: {
      clearPreviousTransactionItems: _clearPreviousTransactionItems,
      offset: _offset,
    },
    showErrorAlerts: showErrorAlerts,
    onErrorAlertDismissal: onErrorAlertDismissal
  };
  return result;
}
// ---------------------------------------------------------------------



/* ------------------------------------------------------------------ */
/* ---------------------    Actions    ------------------------------ */
/* ------------------------------------------------------------------ */
/**
 *
 * @description This should only be called by a saga, not directly from a component
 */
 
export function setAmazonTransactionsFilter(_transactionFilter: IAmazonTransactionRequest): IAppActionResult {
  const result: IAppActionResult = {
    type: AppActionsTypes.SET_TRANSACTION_FILTER,
    payload: {
      transactionFilter: _transactionFilter
    }
  };
  return result;
}
// ----------------------


/* ------------------------------------------------------------------ */
/* ------------------    Saga Triggers    --------------------------- */
/* ------------------------------------------------------------------ */
export function initAppStateAsync(): ISagaTriggerObject {
  return {
    type: AppActionsTypes.INIT_APP_STATE_SAGA
  };
}
// ----------------------
