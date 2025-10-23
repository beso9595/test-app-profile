import { Injectable } from '@angular/core';
import { NavigationItem } from "../models/navigationItem";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  loader$ = new BehaviorSubject<boolean>(false);

  menuList: NavigationItem[] = [
    { title: 'About Us', route: '/about', authenticated: false },
    { title: 'Pricing', route: '/pricing', authenticated: false },
    { title: 'Sign In', route: '/sign-in', authenticated: false }
  ];

  userSubMenuList: NavigationItem[] = [
    { title: 'Profile', route: '/profile' },
    { title: 'Edit Profile', route: '/edit-profile' },
    { title: 'Log Out', route: '/log-out' },
  ];

  constructor() { }
}
