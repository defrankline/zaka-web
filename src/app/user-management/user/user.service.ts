import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GenderEntity, User, UserUploadItem} from './user';
import {CustomResponse} from "../../shared/custom-response";
import {PasswordReset} from "../password-reset-form/password-reset";

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

  public download(format = 'PDF', divisionId: number)
    : any {
    return this.http.get(this.URL + '/contacts/' + format, {
      params: {
        divisionId: `${divisionId}`,
      },
      responseType: 'arraybuffer'
    });
  }

  public passwordReset(passwordReset: PasswordReset): Observable<CustomResponse> {
    return this.http.post(this.URL + '/passwordReset', passwordReset) as Observable<CustomResponse>;
  }

  public currentUser(): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/current');
  }

  get(id: number): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/' + id);
  }

  genderList(): GenderEntity[] {
    return [
      {id: 'MALE', name: 'Male'},
      {id: 'FEMALE', name: 'Female'}
    ];
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

  upload(data: UserUploadItem[]) {
    return this.http.post(this.URL + '/upload', data) as Observable<CustomResponse>;
  }
}
