import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {MemberRegistrationRequest} from './member-registration-request';
import {ApiConfig} from "../shared";

export abstract class CrudService<T = any> {
  abstract endpoint;
  url = '';

  protected constructor(protected http: HttpClient) {
  }

  public async get<G>(request: string): Promise<G | null> {
    let response = null;
    try {
      response = await this.http
        .get<G>(`${this.url}/${this.endpoint}/${request}`)
        .toPromise();
    } catch (error) {
      response = this.errorHandler('GET', error);
    }
    return response;
  }

  public async getList(): Promise<T[] | null> {
    return this.get<T[]>('list');
  }

  public async getById(id: number | string): Promise<T | null> {
    return this.get<T>('' + id);
  }

  public async login(usernameOrEmail: string, password: string): Promise<any> {
    let response = null;
    try {
      response = await this.http.post(`${ApiConfig.url}/auth/login`, {usernameOrEmail, password}).toPromise();
    } catch (error) {
      response = this.errorHandler('POST', error);
    }
    return response;
  }

  public async loginNew(usernameOrEmail: string, password: string): Promise<any> {
    let response = null;
    try {
      response = await this.http.post(`${ApiConfig.url}/auth/loginNew`, {usernameOrEmail, password}).toPromise();
    } catch (error) {
      response = this.errorHandler('POST', error);
    }
    return response;
  }

  public async loginNewWeb(usernameOrEmail: string, password: string): Promise<any> {
    let response = null;
    try {
      response = await this.http.post(`${ApiConfig.url}/auth/loginNewWeb`, {usernameOrEmail, password}).toPromise();
    } catch (error) {
      response = this.errorHandler('POST', error);
    }
    return response;
  }

  public async validateTOtp(username: string, password: string, otpnum: number): Promise<any> {
    let response = null;
    try {
      response = await this.http.post(`${ApiConfig.url}/auth/validateOtp`, {username, password, otpnum}).toPromise();
    } catch (error) {
      response = this.errorHandler('POST', error);
    }
    return response;
  }

  public async validateCurrentUserOtp(password: string, otpnum: number): Promise<any> {
    let response = null;
    try {
      response = await this.http.post(`${ApiConfig.url}/auth/validateCurrentUserOtp`, {password, otpnum}).toPromise();
    } catch (error) {
      response = this.errorHandler('POST', error);
    }
    return response;
  }

  public async signUp(data: MemberRegistrationRequest): Promise<any> {
    let response = null;
    try {
      response = await this.http.post(`${ApiConfig.url}/auth/memberRegistration`, data).toPromise();
    } catch (error) {
      response = this.errorHandler('POST', error);
    }
    return response;
  }

  public async resolveMember(memberNumber: string, companyNumber: string): Promise<any> {
    let response = null;
    try {
      response = await this.http.get(`${ApiConfig.url}/auth/resolveMember`, {
        params: {
          memberNumber, companyNumber
        }
      }).toPromise();
    } catch (error) {
      response = this.errorHandler('GET', error);
    }
    return response;
  }

  public async resolveCompany(companyNumber: string): Promise<any> {
    let response = null;
    try {
      response = await this.http.get(`${ApiConfig.url}/auth/resolveCompany`, {
        params: {
          number: companyNumber
        }
      }).toPromise();
    } catch (error) {
      response = this.errorHandler('GET', error);
    }
    return response;
  }

  public async userLogout(): Promise<any> {
    let response = null;
    try {
      response = await this.http.get(`${ApiConfig.url}/auth/logout`).toPromise();
    } catch (error) {
      response = this.errorHandler('GET', error);
    }
    return response;
  }


  public async deleteById(id: number | string): Promise<any> {
    let response = null;
    try {
      response = await this.http
        .delete(`${this.url}/${this.endpoint}/${id}`)
        .toPromise();
    } catch (error) {
      response = this.errorHandler('DELETE', error);
    }
    return response;
  }

  public errorHandler(
    method: string,
    error: HttpErrorResponse,
  ): Promise<never> {
    console.error(
      `Error occurred during ${method} ${this.url}/${this.endpoint}`,
      error,
    );
    return Promise.reject(error);
  }
}
