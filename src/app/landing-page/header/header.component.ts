import {Component, OnInit, HostListener, HostBinding, Inject, Input} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {WINDOW} from '../helpers/window.helper';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isFixed;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    if (offset > 10) {
      this.isFixed = true;
    } else {
      this.isFixed = false;
    }
  }

  @HostBinding('class.menu-opened') menuOpened = false;

  toggleMenu(): void {
    this.menuOpened = !this.menuOpened;
  }

  login(): void {
    this.router.navigate(['/auth/login']);
  }
}
