import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StorageKey} from './storage.model';
import {CrudService} from './crud.service';
import {StorageService} from './storage.service';
import {NgxPermissionsService} from 'ngx-permissions';
import {MemberRegistrationRequest} from './member-registration-request';
import {Observable} from 'rxjs';
import {Role} from '../user-management/role/role';
import {ToastService} from '../shared/services/toast.service';
import {PasswordReset} from '../user-management/user/password-reset';
import {ApiConfig} from '../shared';
import {User} from '../user-management/user';
import {CustomResponse} from '../shared/custom-response';
import {Router} from '@angular/router';
import {AppService} from "../app.service";
import {MatDialog} from "@angular/material/dialog";

const {AUTH_TOKEN} = StorageKey;
const {CURRENT_USER} = StorageKey;
const {EXPIRE} = StorageKey;
const {USERNAME} = StorageKey;
const {PASSWORD} = StorageKey;
const {MOBILE} = StorageKey;
const {OTP} = StorageKey;
const {USER_ID} = StorageKey;
const {LAST_URL} = StorageKey;

@Injectable({
  providedIn: 'root',
})
export class AuthService extends CrudService {
  endpoint = 'auth';
  token: string;
  username: string;
  otp: number;
  mobile: string;
  password: string;
  currentUser: any;
  expire: any;
  userId: string;
  redirectUrl: string;

  constructor(
    http: HttpClient,
    private storage: StorageService,
    private toast: ToastService,
    private router: Router,
    private dialogRef: MatDialog,
    private appService: AppService,
    private ngxPermissionsService: NgxPermissionsService
  ) {
    super(http);
    this.token = this.storage.read(AUTH_TOKEN) || '';
    this.username = this.storage.read(USERNAME) || '';
    this.mobile = this.storage.read(MOBILE) || '';
    this.password = this.storage.read(PASSWORD) || '';
    this.currentUser = this.storage.read(CURRENT_USER) || '';
    this.userId = this.storage.read(USER_ID) || '';
    this.otp = this.storage.read(OTP) || 0;
    this.expire = this.storage.read(EXPIRE) || '';
  }

  loadLastFour(): string {
    return this.mobile.substr(this.mobile.length - 4);
  }

  public async signIn(usernameOrEmail: string, password: string): Promise<any> {
    try {
      const response = await this.login(usernameOrEmail, password);
      this.userId = response.data.id;
      this.username = response.data.username;
      this.mobile = response.data.mobile;
      this.otp = response.data.otpnum as number;
      this.password = response.data.password;
      this.storage.save(USER_ID, this.userId);
      this.storage.save(USERNAME, this.username);
      this.storage.save(PASSWORD, this.password);
      this.storage.save(MOBILE, this.mobile);
      this.storage.save(OTP, this.otp);
      return response;
    } catch (error) {
      return await Promise.reject(error);
    }
  }

  public async signInNew(usernameOrEmail: string, password: string): Promise<any> {
    try {
      const response = await this.loginNewWeb(usernameOrEmail, password);
      this.token = response.data.accessToken;
      this.userId = response.data.currentUserDto.user.id;
      this.username = response.data.currentUserDto.user.username;
      this.currentUser = response;
      this.ngxPermissionsService.loadPermissions(
        this.processRoles(this.userId, response.data.currentUserDto.roles)
      );
      this.expire = String(this.expireTime(response.data.expiresInMsec));
      this.storage.save(AUTH_TOKEN, this.token);
      this.storage.save(CURRENT_USER, this.currentUser);
      this.storage.save(EXPIRE, this.expire);
      this.storage.save(USER_ID, this.userId);
      this.storage.save(USERNAME, this.username);
      this.appService.setUserLoggedIn(true);
      return response;
    } catch (error) {
      return await Promise.reject(error);
    }
  }

  public currentUserOTP(): Observable<CustomResponse> {
    return this.http.get(
      `${ApiConfig.url}/auth/generateCurrentUserOTP`
    ) as Observable<CustomResponse>;
  }

  public async validateOtp(otpnum: number): Promise<any> {
    try {
      const response = await this.validateTOtp(
        this.username,
        this.password,
        otpnum
      );
      this.token = response.data.accessToken;
      this.currentUser = response;
      this.ngxPermissionsService.loadPermissions(
        this.processRoles(this.userId, response.data.currentUserDto.roles)
      );
      this.expire = String(this.expireTime(response.data.expiresInMsec));
      this.storage.save(AUTH_TOKEN, this.token);
      this.storage.save(CURRENT_USER, this.currentUser);
      this.storage.save(EXPIRE, this.expire);
      this.storage.remove(USERNAME);
      this.storage.remove(PASSWORD);
      this.storage.remove(MOBILE);
      this.storage.remove(OTP);
      this.storage.remove(USER_ID);
      return this.redirectUrl;
    } catch (error) {
      console.error('Error during login request', error);
      return await Promise.reject(error);
    }
  }

  public async validateCurrentUser(
    password: string,
    otpnum: number
  ): Promise<any> {
    try {
      const response = await this.validateCurrentUserOtp(password, otpnum);
      this.token = response.data.accessToken;
      this.currentUser = response;
      this.ngxPermissionsService.loadPermissions(
        this.processRoles(this.userId, response.data.currentUserDto.roles)
      );
      this.expire = String(this.expireTime(response.data.expiresInMsec));
      this.storage.save(AUTH_TOKEN, this.token);
      this.storage.save(CURRENT_USER, this.currentUser);
      this.storage.save(EXPIRE, this.expire);
      this.storage.remove(USERNAME);
      this.storage.remove(PASSWORD);
      this.storage.remove(MOBILE);
      this.storage.remove(OTP);
      this.storage.remove(USER_ID);
      return response;
    } catch (error) {
      console.error('Error during login request', error);
      return await Promise.reject(error);
    }
  }

  public async register(data: MemberRegistrationRequest): Promise<any> {
    try {
      return await this.signUp(data);
    } catch (error) {
      console.error('Error during registration request', error);
      return await Promise.reject(error);
    }
  }

  public async resolveMemberId(
    memberNumber: string,
    companyNumber: string
  ): Promise<any> {
    try {
      return await this.resolveMember(memberNumber, companyNumber);
    } catch (error) {
      console.error('Error during member data request', error);
      return await Promise.reject(error);
    }
  }

  public async resolveCompanyId(companyNumber: string): Promise<any> {
    try {
      return await this.resolveCompany(companyNumber);
    } catch (error) {
      console.error('Error during company data request', error);
      return await Promise.reject(error);
    }
  }

  private async backendLogout(): Promise<any> {
    try {
      return await this.userLogout();
    } catch (error) {
      console.error('Error logout', error);
      return await Promise.reject(error);
    }
  }

  processRoles(userId: string, roles: Role[]): string[] {
    const list = [];
    roles.map((item) => {
      list.push(item.name);
    });
    if (Number(userId) === 4528857) {
      list.push('ROLE_SUPER_USER');
    }
    return list;
  }

  public getToken(): string {
    return this.token;
  }

  public getUsername(): string {
    return this.username;
  }

  public getMobile(): string {
    return this.mobile;
  }

  public getUserId(): number {
    return Number(this.userId);
  }

  public getOtp(): number {
    return this.otp;
  }

  public getPassword(): string {
    return this.password;
  }

  public getCompany(): any {
    return this.currentUser?.data?.currentUserDto?.user?.company;
  }

  public getUser(): User {
    return this.currentUser?.data?.currentUserDto?.user;
  }

  public async logout(): Promise<any> {
    this.token = '';
    this.currentUser = '';
    this.expire = '';
    this.storage.remove(AUTH_TOKEN);
    this.storage.remove(CURRENT_USER);
    this.storage.remove(EXPIRE);
    this.storage.remove(USERNAME);
    this.storage.remove(MOBILE);
    this.storage.remove(PASSWORD);
    this.storage.remove(USER_ID);
    this.appService.setUserLoggedIn(false);
    this.dialogRef.closeAll();
    await this.backendLogout();
  }

  public expireTime(expireDuration): number {
    return Number(new Date(Date.now() + expireDuration));
  }

  public changePassword(passwordReset: PasswordReset): Observable<CustomResponse> {
    return this.http.post(
      `${ApiConfig.url}/auth/changePassword`,
      passwordReset
    ) as Observable<CustomResponse>;
  }

  public isLogged(): boolean {
    const expire = this.storage.read(EXPIRE);
    if (expire) {
      return expire >= Number(Date.now());
    } else {
      return false;
    }
  }

  public user(): any {
    return this.storage.read(CURRENT_USER);
  }
}
