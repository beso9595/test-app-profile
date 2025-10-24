import { Injectable } from '@angular/core';
import { NavigationItem } from "../models/navigationItem";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  loader$ = new BehaviorSubject<boolean>(false);

  menuList: NavigationItem[] = [
    { title: 'About Us', route: '/about' },
    { title: 'Pricing', route: '/pricing' },
    { title: 'Sign In', route: '/sign-in', showWhenLoggedIn: false }
  ];

  userSubMenuList: NavigationItem[] = [
    { title: 'Profile', route: '/profile' },
    { title: 'Edit Profile', route: '/profile/edit' },
    { title: 'Log Out', route: '/logout' },
  ];

  constructor() { }
}
