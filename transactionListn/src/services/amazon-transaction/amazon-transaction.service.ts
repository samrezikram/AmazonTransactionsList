import { IAmazonTransactionResponse, IAmazonTransactionRequest } from '@models/http/transaction.model';
import { HttpService } from '@services/http/http.service';


class AmazonTransactionService {

  private static instance: AmazonTransactionService;

  private constructor() {}

  // Singleton Handling ----------------------------------------------------
  static _getInstance(): AmazonTransactionService {
    if (!AmazonTransactionService.instance) {
      AmazonTransactionService.instance = new AmazonTransactionService();
    }
    return AmazonTransactionService.instance;
  }
  // -----------------------------------------------------------------------

  // Public Methods --------------------------------------------------------
  public async getAmazonTransactions(request: IAmazonTransactionRequest): Promise<IAmazonTransactionResponse> {
    const params: URLSearchParams = new URLSearchParams();
    params.append('offset', `${request.offset}`);
    return HttpService.get('/default/get-transaction-list', params);
  }
  // --------------------
}

export const AmazonService = AmazonTransactionService._getInstance();
