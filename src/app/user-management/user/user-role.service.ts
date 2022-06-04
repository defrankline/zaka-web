import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserRole} from './user-role';
import {environment} from '../../../environments/environment.prod';
import {CustomResponse} from '../../utils/custom-response';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  private readonly URL = environment.api + '/userRoles';

  constructor(private http: HttpClient) {
  }

  getAll(userId: number): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        userId: `${userId}`,
      }
    });
  }

  getAllPaged(page: number, size: number, userId: number): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/page', {
      params: {
        page: `${page}`,
        size: `${size}`,
        userId: `${userId}`,
      }
    });
  }

  public store(userRole: any): Observable<CustomResponse> {
    return this.http.post(this.URL, userRole) as Observable<CustomResponse>;
  }

  public update(userRole: UserRole): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + userRole.id, userRole) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }
}
