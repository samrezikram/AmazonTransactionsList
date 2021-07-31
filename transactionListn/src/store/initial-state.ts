import { ThemeName, ThemeKind } from '@enums/theme-name.enum';

import { IGlobalState, IAppState, IThemeState } from '@models/app/global-state.model';
import { IAmazonTransactionRequest } from '@models/http/transaction.model';

// App State ------------------------------------
export function getInitialAppState(): IAppState  {
    return {
        doneInitializing: false,
        totalCount: 0,
        clearPreviousTransactionItems: false,
        transactionItems: [],
        isLoadingTransactionItems: false,
        transactionGroups: [],
        transactionFilter: {
            startDate: '',
            endDAte: '',
            offset: 0,
            limit: 20,
        } as IAmazonTransactionRequest,
        transactionLoadingError: '',
    };
}
// ----------------------------------------------

// Theme State ----------------------------------
export function getInitialThemeState(): IThemeState {
    return {
        doneInitializing: false,
        isAuto: false,
        themeName: ThemeName.Light,
        themeKind: ThemeKind.Light
    };
}
// ----------------------------------------------

export const initialState: IGlobalState = {
    app: getInitialAppState(),
    theme: getInitialThemeState()
};
