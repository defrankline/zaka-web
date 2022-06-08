import { Component, OnInit, Input } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import {AuthService} from "../../auth/auth.service";
import {StorageService} from "../../auth/storage.service";
import {DomSanitizer} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {NgxPermissionsService} from "ngx-permissions";
import {ToastService} from "../../shared/services/toast.service";
import {StorageKey} from "../../auth/storage.model";
import {BehaviorSubject, filter, Observable} from "rxjs";
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";
import {map} from "rxjs/operators";
import {Tile} from "../../settings/tile/tile";
import {TileService} from "../../settings/tile/tile.service";
import {UserService} from "../../user-management/user/user.service";
import {User} from "../../user-management/user/user";

const THEME_DARKNESS_SUFFIX = `-dark`;
const {LANGUAGE} = StorageKey;
const {THEME} = StorageKey;
const {DARK_MODE} = StorageKey;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  currentTime: any;
  user: User;
  logo: any;
  profilePhoto: any;
  panelOpenState = false;
  menuListSubject: BehaviorSubject<Tile[]> = new BehaviorSubject([]);

  loading$ = this.router.events.pipe(
    filter(
      event =>
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError ||
        event instanceof NavigationStart
    ),
    map(event => (event instanceof NavigationStart ? true : false))
  );
  currentUserSubject: BehaviorSubject<User> = new BehaviorSubject(null);
  themeColor: 'primary' | 'accent' | 'warn' = 'primary';
  isDark = false;
  constructor(private overlayContainer: OverlayContainer,
              private tileService: TileService,
              private storeSvc: StorageService,
              private router: Router,
              private userService: UserService,
              private sanitizer: DomSanitizer,
              private translateService: TranslateService,
              private ngxPermissionService: NgxPermissionsService,
              private toast: ToastService,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.storeSvc.read(StorageKey.CURRENT_USER) as User;
    const lang = this.storeSvc.read(LANGUAGE) || 'en';
    this.translateService.use(lang);
    if (this.user) {
      this.toast.success('Hello', 'Welcome back ' + this.user.username, 2000);
    }
    this.loadTiles();
    this.loadCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  loadCurrentUser(): void {
    this.authService.currentUser().subscribe(response => {
      this.currentUserSubject.next(response.data);
    });
  }

  getCurrentUser(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    if (this.isDark) {
      this.overlayContainer.getContainerElement().classList.add('dark-theme');
    } else {
      this.overlayContainer
        .getContainerElement()
        .classList.remove('dark-theme');
    }
  }

  translate(language: string): void {
    this.storeSvc.save(LANGUAGE, language);
    this.translateService.use(language);
  }

  loadTiles(): void {
    this.tileService.currentUser().subscribe(response => {
      this.menuListSubject.next(response.data);
    });
  }

  getMunu(): Observable<Tile[]> {
    return this.menuListSubject.asObservable();
  }
}
