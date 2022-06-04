import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from '../../utils/custom-response';
import {User, UserUpload} from './user';
import {Login, LoginResponse} from '../../views/login/login';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly URL = environment.api + '/users';

  constructor(private http: HttpClient) {
  }

  getAll(divisionId: number, queryString = '_', page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL, {
      params: {
        divisionId: `${divisionId}`,
        query: `${queryString}`,
        page: `${page}`,
        size: `${size}`,
      }
    });
  }

  search(page = 0, size = 0, query = '_'): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
        query: `${query}`,
      }
    });
  }

  public currentUser(): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/current');
  }

  get(id: number): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/' + id);
  }

  public store(item: User): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: User): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }

  upload(data: UserUpload) {
    return this.http.post(this.URL + '/upload', data) as Observable<CustomResponse>;
  }
}
