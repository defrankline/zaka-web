import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {ToastService} from '../../shared/services/toast.service';
import {StorageService} from '../storage.service';
import {AppService} from "../../app.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  title = 'Speedy Finances';
  usernameOrEmail: string | undefined;
  password: string | undefined;
  errorMessage: string | undefined;
  hide = true;
  captchaError = false;
  loading = false;

  constructor(private authService: AuthService,
              private router: Router,
              private appService:AppService,
              private storage: StorageService,
              private toast: ToastService) {
  }

  ngOnInit(): void {
    this.errorMessage = '';
    if (this.authService.isLogged()) {
      const url = 'app';
      this.router.navigate([url], {replaceUrl: true});
    }
  }

  public async login(usernameOrEmail: string, password: string): Promise<any> {
    try {
      const response = (await this.authService.signIn(usernameOrEmail, password)) as any;
      const changedDefaultPassword = response.data.changedDefaultPassword as boolean;
      let url = 'auth/otp';
      if (!changedDefaultPassword) {
        url = 'auth/change-password';
      }
      if (changedDefaultPassword) {
        this.toast.success('Success!', 'Verification Code Sent to a number ending in *** *** ' + this.authService.loadLastFour(), 5000);
      }
      await this.router.navigate([url]);
    } catch (e) {
      this.loginError(e);
    }
  }

  public async loginNew(usernameOrEmail: string, password: string): Promise<any> {
    this.loading = true;
    try {
      const response = (await this.authService.signInNew(usernameOrEmail, password)) as any;
      const changedDefaultPassword = response.data.changedDefaultPassword as boolean;
      let url = '/app';
      if (!changedDefaultPassword) {
        url = 'auth/change-password';
      }
      /*if (changedDefaultPassword) {
        this.toast.success('Success!', 'Verification Code Sent to a number ending in *** *** ' + this.authService.loadLastFour(), 5000);
      }*/
      await this.router.navigate([url]);
    } catch (e) {
      this.loginError(e);
    }
  }

  private loginError(e: any): void {
    if (e.status === 401) {
      this.toast.error('Access Denied!', 'Please provide correct username/email and password', 5000);
    } else {
      this.toast.error('Error', 'Unable to Login, try again later');
    }
  }

  join() {
    this.router.navigate(['auth/register']);
  }
}
