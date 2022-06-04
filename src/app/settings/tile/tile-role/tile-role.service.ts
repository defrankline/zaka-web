import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from '../../../utils/custom-response';
import {TileRole} from './tile-role';

@Injectable({
  providedIn: 'root'
})
export class TileRoleService {
  private readonly URL = environment.api + '/tileRoles';

  constructor(private http: HttpClient) {
  }

  getAll(page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
      }
    });
  }

  getAllByRoleId(roleId: number, page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/findAllByRoleId', {
      params: {
        roleId: `${roleId}`,
        page: `${page}`,
        size: `${size}`,
      }
    });
  }

  getAllByTileId(tileId: number, page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/findAllByTileId', {
      params: {
        tileId: `${tileId}`,
        page: `${page}`,
        size: `${size}`,
      }
    });
  }

  get(id: number): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/' + id);
  }

  public store(item: TileRole): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: TileRole): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }
}
