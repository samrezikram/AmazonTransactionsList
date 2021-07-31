import { LocalStorageService } from '@services/local-storage/local-storage.service';
import { IAmazonTransactionRequest, IAmazonTransactionResponse } from '../models/http/transaction.model';
import { AmazonService } from '@services/amazon-transaction/amazon-transaction.service';
import { SagaIterator } from 'redux-saga';
import { takeLeading, takeLatest, put, call, select } from 'redux-saga/effects';

import { LocalStorageKey } from '@enums/local-storage-keys.enum';
import { AppActionsTypes } from '@enums/actions-types.enum';

import { IGlobalError, ISagaThrownError } from '@models/app/errors.model';
import { IGlobalState } from '@models/app/global-state.model';
import { ITransaction, ITransactionJSON } from '@models/app/transaction-json.model';
import { ITransactionGroup, IAmazonTransactionSagaTriggerObject } from '@models/actions-results.model';

import { _setAmazonTransactionGroups, _setAmazonTransactionItems, _setDoneInitializingApp, _setIsLoadingAmazonTransactionItems, _setTotalAmazonTransactionCount, _setAmazonTransactionLoadingError} from '@actions/app.actions';

import { getInitialAppState } from '@store/initial-state';

import { SagaErrorHandler } from '@error-handlers/saga-error-handler';
import { emitNextAndComplete, throwError } from '@utils/rxjs-subject-safe-handler';

import _ from 'lodash';
import moment from 'moment';

// Selectors ------------------------------------------------------------------------------------
function getAmazonTransactionFilter(state: IGlobalState): IAmazonTransactionRequest {
  return state.app.transactionFilter || getInitialAppState().transactionFilter || {} as IAmazonTransactionRequest;
}
// -------------------

function getAmazonTransactionItems(state: IGlobalState): ITransaction[] {
  return state.app.transactionItems ?? [];
}
// -------------------

function getTotalAmazonTransactionCount(state: IGlobalState): number {
  return state.app.totalCount ?? 0;
}
// ----------------------------------------------------------------------------------------------

// App Sagas ----------------------------------------------------------------------------------
function* initAppStateSaga(): SagaIterator {
  yield put(_setDoneInitializingApp(true));
}
// -------------------

function* amazonTransactionListSaga(sagaData: IAmazonTransactionSagaTriggerObject): SagaIterator  {
  const sagaName: string = 'amazonTransactionListSaga';
  try {
    const sendAmazonTransactionRequest: IAmazonTransactionRequest = {} as IAmazonTransactionRequest;
    if (sagaData && sagaData.payload &&  sagaData.payload.clearPreviousTransactionItems) {
      yield put(_setTotalAmazonTransactionCount(0));
      yield put(_setAmazonTransactionItems([]));
    }
    yield put(_setIsLoadingAmazonTransactionItems(true));
    yield put(_setAmazonTransactionLoadingError(''));
    const amazonTransactionFilter: IAmazonTransactionRequest = _.cloneDeep(yield select(getAmazonTransactionFilter));


    if (sagaData && sagaData.payload || (sagaData.payload.offset)) {
      sendAmazonTransactionRequest.offset = amazonTransactionFilter.offset;

      const totalItems: number = yield select(getTotalAmazonTransactionCount);


      const incomingAmazonTransactionItems: IAmazonTransactionResponse = yield call(AmazonService.getAmazonTransactions.bind(AmazonService), sendAmazonTransactionRequest);

      const currentAmazonTransactionItems: ITransaction[] = yield select(getAmazonTransactionItems);

      if (incomingAmazonTransactionItems && Array.isArray(incomingAmazonTransactionItems.transactions)) {
        let updatedAmazonTransactionItems: ITransaction[] = [];
        if (amazonTransactionFilter.offset > 0) {
          updatedAmazonTransactionItems = _.uniqBy([...currentAmazonTransactionItems, ...incomingAmazonTransactionItems.transactions], (item: ITransaction) => item.id);
        } else {
          updatedAmazonTransactionItems = incomingAmazonTransactionItems.transactions;
        }
        yield call(setAmazonTransactionItemsAndGroups, updatedAmazonTransactionItems);
        yield put(_setTotalAmazonTransactionCount(incomingAmazonTransactionItems.totalItems));
        yield put(_setIsLoadingAmazonTransactionItems(false));
        yield put(_setAmazonTransactionLoadingError(''));
        emitNextAndComplete(sagaData._observable, true);
      } else {
        const handledError: ISagaThrownError = handleError(new Error, 'Abnormal Behavior from Amazon Rest Api. Fetch Issues returned "null" or a invalid Issues array', sagaName, sagaData.showErrorAlerts, sagaData.onErrorAlertDismissal);
        yield put(_setAmazonTransactionLoadingError(handledError.message));
        yield put(_setIsLoadingAmazonTransactionItems(false));
        emitNextAndComplete(sagaData._observable, false);
      }
    } else {
      const handledError: ISagaThrownError = handleError(new Error, 'Abnormal Behavior from Amazon Rest Api. Fetch Issues returned "null" or a invalid Issues array', sagaName, sagaData.showErrorAlerts, sagaData.onErrorAlertDismissal);
      yield put(_setAmazonTransactionLoadingError(handledError.message));
      yield put(_setIsLoadingAmazonTransactionItems(false));
      emitNextAndComplete(sagaData._observable, false);
    }
  } catch (error) {
    console.log(error);
    yield put(_setAmazonTransactionLoadingError(error));
    yield put(_setIsLoadingAmazonTransactionItems(false));
    yield put(_setAmazonTransactionItems([]));
    emitNextAndComplete(sagaData._observable, false);
    throwError(sagaData._observable, handleError((_.isError(error) ? error : new Error), error, sagaName, sagaData.showErrorAlerts, sagaData.onErrorAlertDismissal));
  }
}
// -------------------

/**
 * This is a helper saga to avoid duplicate code in other sagas
 */
function* setAmazonTransactionItemsAndGroups(items: ITransaction[]): SagaIterator {
  const amazonTransactionGroups: ITransactionGroup[] = [];
  const groupedItems: {[key: string]: ITransaction[]} = _.groupBy(items, (item: ITransaction) => {
    return moment.utc(item.date).local().format('YYYY-MM-DD');
  });
  _.each(groupedItems, (items: ITransaction[], key: string) => {
    amazonTransactionGroups.push({
      date: key,
      data: items
    } as ITransactionGroup);
  });
  yield put(_setAmazonTransactionItems(items));
  yield put(_setAmazonTransactionGroups(amazonTransactionGroups));
}
// ---------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------

// Root App Saga -------------------------------------------------------------------------------
export function* rootAppSaga() {
  yield takeLeading(AppActionsTypes.INIT_APP_STATE_SAGA, initAppStateSaga);
  yield takeLatest(AppActionsTypes.LOAD_AMAZON_TRANSACTION_LIST_SAGA , amazonTransactionListSaga);

}
// ---------------------------------------------------------------------------------------------

// Error Handling ------------------------------------------------------------------------------
function handleError(stackTraceCapturer: Error, error: any, location: string, showErrorAlert?: boolean, onErrorAlertDismissal?: () => void): ISagaThrownError {
  const errorToReport: IGlobalError = {} as IGlobalError;
  return SagaErrorHandler.handleError(errorToReport, location, 'appSaga', showErrorAlert, onErrorAlertDismissal);
}
// ---------------------------------------------------------------------------------------------
