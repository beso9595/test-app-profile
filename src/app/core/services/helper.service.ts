import { Injectable } from '@angular/core';
import { NavigationItem } from "../models/navigationItem";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

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
