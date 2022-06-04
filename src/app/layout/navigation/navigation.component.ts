import { Component, OnInit, Input } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import {AuthService} from "../../auth/auth.service";
import {StorageService} from "../../auth/storage.service";
import {DashletService} from "../../setup-and-configuration/general/dashlet/dashlet.service";
import {CompanyService} from "../../tenancy/company";
import {UserService} from "../../user-management/user";
import {DomSanitizer} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {NgxPermissionsService} from "ngx-permissions";
import {ToastService} from "../../shared/services/toast.service";
import {StorageKey} from "../../auth/storage.model";
import {BehaviorSubject, filter, Observable} from "rxjs";
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";
import {map} from "rxjs/operators";
import {Dashlet} from "../../setup-and-configuration/general/dashlet/dashlet";
import {saveAs} from 'file-saver';

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
  roles = ['ROLE_COURT', 'ROLE_DCO', 'ROLE_ASS_REGISTRAR', 'ROLE_REGISTRAR', 'ROLE_BOT', 'ROLE_TCDC', 'ROLE_COASCO', 'ROLE_PORALG'];
  currentTime: any;
  user: any;
  logo: any;
  profilePhoto: any;
  panelOpenState = false;
  menuListSubject: BehaviorSubject<Dashlet[]> = new BehaviorSubject([]);

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

  themeColor: 'primary' | 'accent' | 'warn' = 'primary';
  isDark = false;
  constructor(private overlayContainer: OverlayContainer,
              private menuService: DashletService,
              private storeSvc: StorageService,
              private router: Router,
              private companyService: CompanyService,
              private userService: UserService,
              private sanitizer: DomSanitizer,
              private translateService: TranslateService,
              private ngxPermissionService: NgxPermissionsService,
              private toast: ToastService,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.storeSvc.read(StorageKey.CURRENT_USER);
    const companyId = this.user.data.currentUserDto.user.company.id;
    this.loadLogo(companyId);
    this.loadProfilePhoto();
    const lang = this.storeSvc.read(LANGUAGE) || 'en';
    this.translateService.use(lang);
    if (this.user) {
      this.toast.success('Hello', 'Welcome back ' + this.user.data.currentUserDto.user.username, 2000);
    }
    this.loadTiles();
  }

  // logout function
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
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

  loadLogo(companyId: number): void {
    this.companyService.getLogo(companyId).subscribe(response => {
      this.logo = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + response.data);
    }, error => {

    });
  }

  loadProfilePhoto(): void {
    this.userService.currentUser().subscribe(response => {
      this.profilePhoto = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + response.data.photo);
    }, error => {

    });
  }

  loadTiles(): void {
    this.menuService.getAllParentsByCurrentUserAndCompanyType().subscribe(response => {
      this.menuListSubject.next(response.data);
    }, error => {
      this.toast.error('Error', 'Menu Could not be loaded');
    });
  }

  getMenu(): Observable<Dashlet[]> {
    return this.menuListSubject.asObservable();
  }

  openLink(link: string, parent: string): void {
    this.router.navigate(['app/' + parent + '/' + link]);
  }

  downloadLedgerNew(): void {
    this.userService.downloadLedgerNew().subscribe(response => {
      saveAs(new Blob([response], {type: 'application/pdf'}), Date.now() + '-ledger.pdf');
    });
  }
}
