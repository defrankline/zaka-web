import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Tile} from './tile';
import {CustomResponse} from "../../shared/custom-response";

@Injectable({
  providedIn: 'root'
})
export class TileService {
  private readonly URL = environment.api + '/tiles';

  constructor(private http: HttpClient) {
  }

  get(id: number): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/' + id);
  }

  getAll(page = 0, size = 0, queryString = '_', parentId = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`,
        parentId: `${parentId}`,
        query: `${queryString}`,
      }
    });
  }

  getAllParents(page = 0, size = 0, queryString = '_'): Observable<CustomResponse> {
    return this.http.get<any>(this.URL + '/parents', {
      params: {
        page: `${page}`,
        size: `${size}`,
        query: `${queryString}`,
      }
    });
  }

  currentUser(): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(this.URL + '/currentUser');
  }

  public store(item: Tile): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: Tile): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<CustomResponse> {
    return this.http.delete(this.URL + '/' + id) as Observable<CustomResponse>;
  }
}
