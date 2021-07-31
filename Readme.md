# Transaction list

Implement a simple Transaction List screen and Transaction details screens.

## Steps to launch project
1. Install dependencies
```bash
npm ci
```

2. Install Pods
```bash
cd ios
pod update
pod install
```

3. Start Metro bundler:
```bash
npm start
```

4. Start iPhone app
```bash
npm run ios
```

## API

The API endpoint for loading the data: https://0bqjf1ad97.execute-api.eu-west-2.amazonaws.com/default/get-transaction-list

### Query string parameters
* startDate: ISO string in YYYY-MM-DD format, optional
* endDAte: ISO string in YYYY-MM-DD format, optional
* offset: number, optional, defaults to 0
* page: number, optional, default to 20

### Response
```ts
interface Response {
  success: boolean;
  limit: number;
  offset: number;
  totalItems: number;
  transactions: Transaction[];
};

interface Transaction {
  id: string;
  amount: number;
  currency: "GBP";
  date: string;
  reference?: string;
  type: "DEBIT" | "CREDIT";
  counterparty: {
    firstName: string;
    lastName: string;
    accountNumber: string;
    sortCode: string;
  };
};
```

## UI

On the main screen display the list of transactions as follows:
* Group transactions by the date
* The data to display for an item in the list:
    * amount and currency (displayed as red when it is a debit transaction and green when it is credit)
    * counterparty name
* Data to display on the transaction details screen:
    * amount
    * currency
    * counterparty name
    * counterparty sort code and account number
    * transaction id
    * date of transaction
    * reference
* The transaction list screen should display only 20 items at first and load more on scroll