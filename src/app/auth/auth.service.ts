import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {StateStorageService} from './state-storage.service';
import {NgxPermissionsService} from 'ngx-permissions';
import {environment} from '../../environments/environment.prod';
import {Role} from '../user-management/role/role';
import {Router} from '@angular/router';
import {CustomResponse} from "../shared/custom-response";
import {Login, LoginResponse} from "./login/login";
import {UserService} from "../user-management/user/user.service";
import {User} from "../user-management/user/user";

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly api = environment.api;

  constructor(
    private http: HttpClient,
    private $localStorage: LocalStorageService,
    private $sessionStorage: SessionStorageService,
    private stateService: StateStorageService,
    private userService: UserService,
    private permissionsService: NgxPermissionsService,
    private router: Router,
  ) {
  }

  getToken(): string {
    const tokenInLocalStorage: string | null = this.$localStorage.retrieve(
      'accessToken'
    );
    const tokenInSessionStorage: string | null = this.$sessionStorage.retrieve(
      'accessToken'
    );
    return tokenInLocalStorage ?? tokenInSessionStorage ?? '';
  }

  currentUser(): Observable<CustomResponse> {
    return this.http.get<CustomResponse>(environment.api + '/users/current');
  }

  getLanguage(): string {
    const languageInLocalStorage: string | null = this.$localStorage.retrieve(
      'language'
    );
    const languageInSessionStorage: string | null = this.$sessionStorage.retrieve(
      'language'
    );
    return languageInLocalStorage ?? languageInSessionStorage ?? '';
  }

  login(login: Login): Observable<void> {
    const body = `username=${encodeURIComponent(
      login.username
    )}&password=${encodeURIComponent(login.password)}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    });
    return this.http
      .post<LoginResponse>(this.api + '/auth/login', body, {
        headers: headers
      })
      .pipe(
        map((response) =>
          this.authenticateSuccess(response)
        )
      );
  }

  logout(): Observable<void> {
    this.clearAuth();
    return this.http
      .post<any>(this.api + '/auth/logout', {})
      .pipe(map((response) => this.clearAuth()));
  }

  clearAuth(): void {
    this.$localStorage.clear('accessToken');
    this.$localStorage.clear('tokeExpire');
    this.$localStorage.clear('user');
    this.$localStorage.clear('CURRENT_USER');
    this.$localStorage.clear('previousUrl');
    this.$sessionStorage.clear('accessToken');
    this.$sessionStorage.clear('tokeExpire');
    this.$sessionStorage.clear('user');
    this.$sessionStorage.clear('CURRENT_USER');
    this.$sessionStorage.clear('previousUrl');
    this.permissionsService.flushPermissions();
    this.stateService.clearUrl();
    this.router.navigate(['/login']);
  }

  private authenticateSuccess(response: LoginResponse): void {
    const accessToken = response.accessToken;
    const refreshToken = response.refreshToken;
    const tokeExpire = response.tokeExpire;
    /*const user = response.user;
    this.$localStorage.store('user', user);
    this.permissionsService.loadPermissions(this.processRoles(user.roles));*/
    this.$sessionStorage.store('accessToken', accessToken);
    this.$sessionStorage.store('refreshToken', refreshToken);
    this.$sessionStorage.store('tokeExpire', tokeExpire);
    this.$localStorage.clear('accessToken');
    this.$localStorage.clear('refreshToken');
    this.$localStorage.clear('tokeExpire');
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.userService.currentUser().subscribe((response) => {
      const user = response.data as User;
      this.$localStorage.store('user', user);
      this.$localStorage.store('CURRENT_USER', user);
      this.$sessionStorage.store('CURRENT_USER', user);
      this.$sessionStorage.store('user', user);
      this.permissionsService.loadPermissions(this.processRoles(user.roles));
    });
  }

  public setLanguage(language: string): void {
    this.$sessionStorage.store('language', language);
    this.$localStorage.clear('language');
  }

  public processRoles(roles: Role[]): string[] {
    const list = [];
    roles.map((item) => {
      list.push(item.name);
    });
    return list;
  }

  public isLoggedIn(): boolean {
    const expire: number | 0 = this.$localStorage.retrieve('tokeExpire') ?? this.$sessionStorage.retrieve('tokeExpire');
    if (expire) {
      return expire >= Number(Date.now());
    } else {
      return false;
    }
  }
}
