import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ReminderCategory} from './reminder-category';
import {environment} from '../../../environments/environment.prod';
import {CustomResponse} from "../../shared/custom-response";

@Injectable({
  providedIn: 'root'
})
export class ReminderCategoryService {
  private readonly URL = environment.api + '/reminderCategories';

  constructor(private http: HttpClient) {
  }

  getAll(page = 0, size = 0): Observable<CustomResponse> {
    return this.http.get<any>(this.URL, {
      params: {
        page: `${page}`,
        size: `${size}`
      }
    });
  }

  public store(item: ReminderCategory): Observable<CustomResponse> {
    return this.http.post(this.URL, item) as Observable<CustomResponse>;
  }

  public update(item: ReminderCategory): Observable<CustomResponse> {
    return this.http.put(this.URL + '/' + item.id, item) as Observable<CustomResponse>;
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(this.URL + '/' + id);
  }
}
