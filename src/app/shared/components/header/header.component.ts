import { Component } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { HelperService } from "../../../core/services/helper.service";
import { NavigationItem } from "../../../core/models/navigationItem";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { MatMenuModule } from "@angular/material/menu";
import { GLOBAL } from "../../data/global";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    MatButtonModule,
    NgOptimizedImage,
    NgForOf,
    RouterLink,
    NgIf,
    RouterLinkActive,
    AsyncPipe,
    MatMenuModule,
  ],
  standalone: true
})
export class HeaderComponent {
  menuList: NavigationItem[] = [];
  userSubMenuList: NavigationItem[] = [];

  isAuthenticated = false;

  defaultAvatar = GLOBAL.DEFAULT_AVATAR;

  constructor(
    public helperService: HelperService,
    public authService: AuthService,
  ) {
    this.menuList = this.helperService.menuList;
    this.userSubMenuList = this.helperService.userSubMenuList;
    //
    this.authService.isAuthenticated$.subscribe(v => this.isAuthenticated = v);
  }
}
