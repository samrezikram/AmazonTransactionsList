import { ITransaction } from './../app/transaction-json.model';


// * startDate: ISO string in YYYY-MM-DD format, optional
// * endDAte: ISO string in YYYY-MM-DD format, optional
// * offset: number, optional, defaults to 0
// * page: number, optional, default to 20
export interface IAmazonTransactionRequest {
  startDate: string,
  endDAte: string,
  offset: number,
  limit: number,
  totalItems: number
}
// --------------


export interface IGenericApiResponse {
  success: boolean;
  limit: number;
  offset: number;
  totalItems: number;
  transactions: ITransaction[]
}
// -----------------------------------------------------------------

export interface ISuccessResponse {
  success: boolean;
  statusText: string;
  status: number | string; // 200 For Success
}
// -----------------------------------------------------------------

export interface IAmazonTransactionResponse extends ISuccessResponse {
  limit: number;
  offset: number;
  totalItems: number;
  transactions: ITransaction[]
}