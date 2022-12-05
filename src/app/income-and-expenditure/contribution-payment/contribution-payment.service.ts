import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from "../../shared/custom-response";
import {ContributionPayment, ContributionPaymentUploadDto} from './contribution-payment';

@Injectable({
  providedIn: 'root'
})
export class ContributionPaymentService {
  private readonly URL = environment.api + '/contributionPayments';

  constructor(private http: HttpClient) {
  }

  public getAll(divisionId: number, queryString = '_', page = 0, size = 0, startDate = '', endDate = '', contributions = '')
    : Observable<CustomResponse> {
    return this.http.get(this.URL, {
      params: {
        divisionId: `${divisionId}`,
        query: `${queryString}`,
        page: `${page}`,
        size: `${size}`,
        startDate: `${startDate}`,
        endDate: `${endDate}`,
        contributions: `${contributions}`,
      }
    }) as Observable<CustomResponse>;
  }

  public monthlyReport(startDate = '', endDate = ''): Observable<CustomResponse> {
    return this.http.get(this.URL + '/monthlyReport', {
      params: {
        startDate: `${startDate}`,
        endDate: `${endDate}`,
      }
    }) as Observable<CustomResponse>;
  }

  public newReceiptNumber(): Observable<CustomResponse> {
    return this.http.get(this.URL + '/newReceiptNumber') as Observable<CustomResponse>;
  }

  public store(item: ContributionPayment): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: ContributionPayment): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  public delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }

  public upload(item: ContributionPaymentUploadDto): Observable<CustomResponse> {
    return this.http.post(this.URL + '/upload', item) as Observable<CustomResponse>;
  }

  printReceipt(id: number): any {
    return this.http.get(this.URL + '/paymentReceipt', {
      params: {
        id: `${id}`
      }
    });
  }

  public download(format = 'PDF', divisionId: number, queryString = '_', startDate = '', endDate = '', contributions = '')
    : any {
    return this.http.get(this.URL + '/printReport/' + format, {
      params: {
        divisionId: `${divisionId}`,
        query: `${queryString}`,
        startDate: `${startDate}`,
        endDate: `${endDate}`,
        contributions: `${contributions}`,
      },
      responseType: 'arraybuffer'
    });
  }
}
