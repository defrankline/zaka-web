import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LedgerAccount} from './ledger-account';
import {environment} from '../../../environments/environment.prod';
import {CustomResponse} from '../../utils/custom-response';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  token: string;

  private readonly URL = environment.api + '/accounts';

  constructor(private http: HttpClient) {
  }

  public getAccountsWithBalance(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/getAccountsWithBalance') as Observable<CustomResponse>;
  }

  public coa(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/coa') as Observable<CustomResponse>;
  }

  public incomeStatement(divisionId = 0): Observable<CustomResponse> {
    return this.http.get(this.URL + '/incomeStatement', {
      params: {
        divisionId: `${divisionId}`,
      }
    }) as Observable<CustomResponse>;
  }

  public balanceSheet(divisionId = 0): Observable<CustomResponse> {
    return this.http.get(this.URL + '/balanceSheet', {
      params: {
        divisionId: `${divisionId}`,
      }
    }) as Observable<CustomResponse>;
  }

  public cashFlowStatement(divisionId = 0): Observable<CustomResponse> {
    return this.http.get(this.URL + '/cashFlowStatement', {
      headers: {
        Authorization: 'Bearer ' + this.token,
      },
      params: {
        divisionId: `${divisionId}`,
      }
    }) as Observable<CustomResponse>;
  }

  getAll(queryString = '_', accountGroupId = 0, page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
        accountGroupId: `${accountGroupId}`,
        sortBy: `number`,
        query: `${queryString}`,
      }
    });
  }

  getAllPagedByAccountSubTypeId(queryString: string, accountSubTypeId: number, page: number, size: number): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/getAllPagedByAccountSubTypeId', {
      params: {
        page: `${page}`,
        size: `${size}`,
        accountSubTypeId: `${accountSubTypeId}`,
        query: `${queryString}`,
      }
    });
  }

  getAllPagedByAccountTypeId(page: number, size: number, queryString: string, accountTypeId: number): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/getAllPagedByAccountTypeId', {
      params: {
        page: `${page}`,
        size: `${size}`,
        accountTypeId: `${accountTypeId}`,
        query: `${queryString}`,
      }
    });
  }

  public store(account: LedgerAccount): Observable<CustomResponse> {
    return this.http.post(this.URL, account) as Observable<CustomResponse>;
  }

  public update(account: LedgerAccount): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + account.id, account) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }

  public primaryExpenseAccounts(queryString = '_'): Observable<CustomResponse> {
    return this.http.get(this.URL + '/primaryExpenseAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public fixedAndPrimaryExpenseAccounts(queryString = '_'): Observable<CustomResponse> {
    return this.http.get(this.URL + '/fixedAndPrimaryExpenseAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public fixedAssetAccounts(queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/fixedAssetAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public accumulatedDepreciationAccounts(queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/accumulatedDepreciationAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public lossAccounts(queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/lossAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public currentAssetAccounts(queryString = '_'): Observable<CustomResponse> {
    return this.http.get(this.URL + '/currentAssetAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public receivableAccounts(queryString = '_'): Observable<CustomResponse> {
    return this.http.get(this.URL + '/receivableAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public investmentAccounts(queryString = '_'): Observable<CustomResponse> {
    return this.http.get(this.URL + '/investmentAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public revenueAccounts(queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/revenueAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public revenueAndLiabilityAndEquityAccounts(queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/revenueAndLiabilityAndEquityAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public assetLiabilityEquityAndRevenueAccounts(queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/assetLiabilityEquityAndRevenueAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public assetAndLiabilityAccounts(queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/assetAndLiabilityAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }


  public liabilityAndEquityAccounts(queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/liabilityAndEquityAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public longTermLiabilityAccounts(queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/longTermLiabilityAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public liabilityAccounts(queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/liabilityAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public bankAndMobileMoneyAccounts(queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/bankAndMobileMoneyAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public bankAndCashAndMobileMoneyAccounts(queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/bankAndCashAndMobileMoneyAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public cashAccounts(queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/cashAccounts', {
      params: {
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public searchCashAccounts(page: number, size: number, queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/searchCashAccounts', {
      params: {
        page: `${page}`,
        size: `${size}`,
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }

  public equityStatement(divisionId = 0): Observable<CustomResponse> {
    return this.http.get(this.URL + '/equityStatement', {
      params: {
        divisionId: `${divisionId}`,
      }
    }) as Observable<CustomResponse>;
  }

  public monthlyIncomeStatementNew(divisionId = 0): Observable<CustomResponse> {
    return this.http.get(this.URL + '/monthlyIncomeStatementNew', {
      params: {
        divisionId: `${divisionId}`,
      }
    }) as Observable<CustomResponse>;
  }

  public cashBookNew(page: number, size: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/cashbook', {
      params: {
        page: `${page}`,
        size: `${size}`,
      }
    }) as Observable<CustomResponse>;
  }

  public generalLedgerNew(accountIds = ''): Observable<CustomResponse> {
    return this.http.get(this.URL + '/generalLedger', {
      params: {
        accountIds: `${accountIds}`,
      }
    }) as Observable<CustomResponse>;
  }

  downloadLegacyIncomeStatement(): any {
    return this.http.get(this.URL + '/downloadLegacyIncomeStatement', {
      responseType: 'arraybuffer'
    });
  }

  downloadCurrentTrialBalance(): any {
    return this.http.get(this.URL + '/printCurrentTrialBalance', {
      responseType: 'arraybuffer'
    });
  }

  public searchBankAndCashAndMobileMoneyAccounts(size: number, queryString: string): Observable<CustomResponse> {
    return this.http.get(this.URL + '/searchBankAndCashAndMobileMoneyAccounts', {
      params: {
        size: `${size}`,
        query: `${queryString}`,
      }
    }) as Observable<CustomResponse>;
  }
}
