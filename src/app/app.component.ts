import {AfterViewInit, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from './auth/auth.service';
import {NgxPermissionsService} from 'ngx-permissions';
import {StorageService} from './auth/storage.service';
import {StorageKey} from './auth/storage.model';
import {Title} from '@angular/platform-browser';
import {filter} from 'rxjs/operators';
import {AppService} from './app.service';
import {LoaderService} from './loader.service';
import {BsModalRef, BsModalService, ModalDirective} from "ngx-bootstrap/modal";
import {Keepalive} from "@ng-idle/keepalive";
import {DEFAULT_INTERRUPTSOURCES, Idle} from "@ng-idle/core";
import {UserService} from "./user-management/user/user.service";
import {User} from "./user-management/user/user";

const {CURRENT_USER} = StorageKey;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[BsModalService]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Zaka Management Information System';
  loading: boolean;
  currentUser: any;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  public modalRef: BsModalRef;
  @ViewChild('childModal', { static: false }) childModal: ModalDirective;

  constructor(private router: Router,
              private userService: UserService,
              private toast: ToastrService,
              private loaderService: LoaderService, private renderer: Renderer2,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private idle: Idle,
              private permissionsService: NgxPermissionsService,
              private keepalive: Keepalive,
              private modalService: BsModalService,
              private appService: AppService,
              private storage: StorageService,
              private authService: AuthService,
              private ngxPermissionsService: NgxPermissionsService) {
    idle.setIdle(300);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(300);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.'
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.childModal.hide();
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!'
      this.childModal.show();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!'

    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.appService.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        idle.watch()
        this.timedOut = false;
      } else {
        idle.stop();
      }
    })

    // this.reset();

  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
    } else {
      this.currentUser = this.storage.read(CURRENT_USER) || '';
      this.loadCurrenUser();
    }

    this.dynamicTitle();
  }

  reset() {
    this.idle.watch();
    this.timedOut = false;
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  stay() {
    this.childModal.hide();
    this.reset();
  }

  loadCurrenUser(): void {
    this.authService.currentUser().subscribe(response => {
      const user = response.data as User;
      this.permissionsService.loadPermissions(this.authService.processRoles(user.roles));
    });
  }

  getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  dynamicTitle(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      const rt = this.getChild(this.activatedRoute);
      rt.data.subscribe(data => {
        this.titleService.setTitle(data.title);
      });
    });
  }


  logout(): void {
    this.authService.logout();
    this.childModal.hide();
    this.router.navigate(['auth/login']);
  }

  ngAfterViewInit(): void {
    this.loaderService.httpProgress().subscribe((status: boolean) => {
      if (status) {
        this.renderer.addClass(document.body, 'cursor-loader');
      } else {
        this.renderer.removeClass(document.body, 'cursor-loader');
      }
    });
  }
}
