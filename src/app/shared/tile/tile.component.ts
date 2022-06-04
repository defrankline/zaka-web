import {Component, Input, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Dashlet} from '../../setup-and-configuration/general/dashlet/dashlet';
import {Router} from '@angular/router';
import {DashletService} from '../../setup-and-configuration/general/dashlet/dashlet.service';
import {NgxPermissionsService} from 'ngx-permissions';

@Component({
  selector: 'app-tile-menu',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() parent: string;
  tiles: Dashlet[] = [];

  constructor(private router: Router,
              private toast: ToastrService,
              private ngxPermissionService: NgxPermissionsService,
              private tileService: DashletService) {
  }

  ngOnInit(): void {
    this.loadTiles(this.parent);
  }

  loadTiles(parent: string): void {
    this.tileService.getAllByParentLinkAndCurrentUserAndCompanyType(parent).subscribe(response => {
      this.refineTiles(response.data);
    }, error => {
      this.toast.error('Menu Could not be loaded', 'Error', {
        timeOut: 5000
      });
    });
  }

  refineTiles(items: Dashlet[]): void {
    const roleTiles = [];
    items.forEach(row => {
      if (this.ngxPermissionService.hasPermission(row.authorities)) {
        roleTiles.push(row);
      }
    });
    this.tiles = roleTiles;
  }
}
