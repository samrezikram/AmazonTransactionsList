import { ThemeName, ThemeKind } from '@enums/theme-name.enum';
import { ITransactionGroup } from '@models/actions-results.model';
import { ITransaction } from '@models/app/transaction-json.model';
import { IAmazonTransactionRequest } from '@models/http/transaction.model';

export interface IGlobalState {
    app: IAppState;
    theme: IThemeState;
}

export interface IAppState {
    doneInitializing?: boolean;
    totalCount?: number;
    clearPreviousTransactionItems?: boolean
    transactionItems?: ITransaction[];
    isLoadingTransactionItems?: boolean;
    transactionGroups?: ITransactionGroup[];
    transactionLoadingError?: string;
    transactionFilter?: IAmazonTransactionRequest;
}
export interface IThemeState {
    doneInitializing?: boolean;
    isAuto?: boolean;
    themeName?: ThemeName;
    themeKind?: ThemeKind;
}
