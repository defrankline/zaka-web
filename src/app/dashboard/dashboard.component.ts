import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {User, UserBelongingDto, UserBelongingWrapperDto, UserService} from '../user-management/user';
import {DashboardService} from './dashboard.service';
import {NgxPermissionsService} from 'ngx-permissions';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MyLoanComponent} from './my-loan/my-loan.component';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  userSubject: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(private storageService: AuthService,
              private dashboardService: DashboardService,
              private userService: UserService,
              private dialog: MatDialog,
              private ngxPermissionService: NgxPermissionsService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.ngxPermissionService.hasPermission(['ROLE_USER']).then(hasPermission => {
      if (hasPermission) {
        this.loadMemberDashboard();
      }
    });
  }

  loadMemberDashboard(): void {
    this.userService.currentUser().subscribe(response => {
      this.userSubject.next(response.data);
    });
  }

  getUserData(): Observable<User> {
    return this.userSubject.asObservable();
  }

  links(items: UserBelongingWrapperDto[], data: string): UserBelongingDto[] {
    const shares = items.filter((book: UserBelongingWrapperDto) => book.label === data) as UserBelongingWrapperDto[];
    return shares[0].items as UserBelongingDto[];
  }

  viewLoansByProductId(loanProductId: number): void {
    const data = {
      id: loanProductId,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '99%';
    dialogConfig.data = data;
    this.dialog.open(MyLoanComponent, dialogConfig);
  }

  viewSharesByTypeId(shareTypeId: number): void {

  }

  viewSavingsByTypeId(savingTypeId: number): void {

  }

  viewDepositsByTypeId(depositTypeId: number): void {

  }

  viewOtherContributionsByTypeId(contributionTypeId: number): void {

  }

  total(items: UserBelongingDto[]): number {
    return items.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }
}
