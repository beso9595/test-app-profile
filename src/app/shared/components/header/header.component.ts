import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { AsyncPipe, NgClass, NgForOf, NgIf, NgOptimizedImage, NgTemplateOutlet } from "@angular/common";
import { HelperService } from "../../../core/services/helper.service";
import { NavigationItem } from "../../../core/models/navigationItem";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { MatMenuModule } from "@angular/material/menu";
import { GLOBAL } from "../../data/global";
import { MatIconModule } from "@angular/material/icon";
import { MatRippleModule } from "@angular/material/core";

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
    MatIconModule,
    MatRippleModule,
    NgTemplateOutlet,
    NgClass,
  ],
  standalone: true
})
export class HeaderComponent {
  @ViewChild('sideBarSubMenu') sideBarSubMenu!: ElementRef;

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

  onMenuToggle(sideMenu: HTMLDivElement): void {
    if (sideMenu.style.display === 'block') {
      sideMenu.style.display = 'none';
    } else {
      sideMenu.style.display = 'block';
    }
  }

  onSubMenuToggle(): void {
    this.onMenuToggle(this.sideBarSubMenu.nativeElement);
  }
}
