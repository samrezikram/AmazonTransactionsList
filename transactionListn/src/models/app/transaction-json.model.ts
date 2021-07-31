export interface ITransactionJSON {
  success: boolean;
  limit: number;
  offset: number;
  totalItems: number;
  transactions: ITransaction[];
}
export interface ITransaction {
  id: string;
  amount: number;
  currency: string;
  date: Date;
  reference: string;
  type: string;
  counterparty: ICounterParty;
}

export interface ICounterParty {
  firstName: string;
  lastName: string;
  accountNumber: string;
  sortCode: string;
}
