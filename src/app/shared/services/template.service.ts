import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private readonly URL = environment.api + '/templates';

  constructor(private http: HttpClient) {
  }

  userUpload(): any {
    return this.http.get(this.URL + '/userUpload', {
      responseType: 'arraybuffer'
    });
  }

  contributionPaymentUpload(): any {
    return this.http.get(this.URL + '/contributionPaymentUpload', {
      responseType: 'arraybuffer'
    });
  }

  contributionCardUpload(): any {
    return this.http.get(this.URL + '/contributionCardUpload', {
      responseType: 'arraybuffer'
    });
  }
}
