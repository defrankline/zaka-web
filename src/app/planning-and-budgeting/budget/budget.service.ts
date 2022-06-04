import {Injectable} from '@angular/core';
import {ApiConfig} from '../../shared';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Rejection} from '../../shared/model/rejection';
import {Budget} from './budget';
import {BudgetUpload} from './upload/budget-upload-item';
import {CustomResponse} from '../../shared/custom-response';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private readonly URL = ApiConfig.url + '/budgets';

  constructor(private http: HttpClient) {
  }

  public getApprovedBudgets(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/approved') as Observable<CustomResponse>;
  }

  public getAll(financialYearId: number): Observable<CustomResponse> {
    return this.http.get(this.URL, {
      params: {
        financialYearId: `${financialYearId}`,
      }
    }) as Observable<CustomResponse>;
  }

  public getOne(id: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/' + id) as Observable<CustomResponse>;
  }

  public sendToRegistrar(id: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/sendToRegistrar', {
      params: {
        id: `${id}`,
      }
    }) as Observable<CustomResponse>;
  }

  public sendToDco(id: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/sendToDco', {
      params: {
        id: `${id}`,
      }
    }) as Observable<CustomResponse>;
  }

  public items(id: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/items', {
      params: {
        id: `${id}`,
      }
    }) as Observable<CustomResponse>;
  }

  public printHtml(budgetId: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/printHtml', {
      params: {
        budgetId: `${budgetId}`,
      }
    }) as Observable<CustomResponse>;
  }

  public actualHtml(budgetId: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/actualHtml', {
      params: {
        budgetId: `${budgetId}`,
      }
    }) as Observable<CustomResponse>;
  }

  printPdf(budgetId: number): any {
    return this.http.get(this.URL + '/printPdf', {
      params: {
        budgetId: `${budgetId}`
      },
      responseType: 'arraybuffer'
    });
  }

  getAllPaged(page: number, size: number, financialYearId: number): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/page', {
      params: {
        page: `${page}`,
        size: `${size}`,
        financialYearId: `${financialYearId}`,
      }
    });
  }

  public store(item: Budget): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public approve(id: number, file: any): Observable<CustomResponse> {
    return this.http.post(this.URL + '/approve', {id, file}) as Observable<CustomResponse>;
  }

  public update(item: Budget): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  public sendBackToCommittee(item: Rejection): Observable<CustomResponse> {
    return this.http.post(this.URL + '/sendBackToCommittee', item) as Observable<CustomResponse>;
  }

  public sendBackToDco(item: Rejection): Observable<CustomResponse> {
    return this.http.post(this.URL + '/sendBackToDco', item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }

  public committeeDocument(id: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/committeeDocument/' + id) as Observable<CustomResponse>;
  }

  public registrarDocument(id: number): Observable<CustomResponse> {
    return this.http.get(this.URL + '/registrarDocument/' + id) as Observable<CustomResponse>;
  }

  public upload(item: BudgetUpload): Observable<CustomResponse> {
    return this.http.post(this.URL + '/upload', item) as Observable<CustomResponse>;
  }
}
