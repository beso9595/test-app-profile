import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";
import { UserService } from "./user.service";
import { PopupService } from "./popup.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  authUser$ = new BehaviorSubject<User | null>(null);

  constructor(
    private userService: UserService,
    private popupService: PopupService
  ) { }

  initAuth(): void {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const user = JSON.parse(auth) as User;
      if (this.userService.getUser(user.id)) {
        this.authUser$.next(JSON.parse(auth));
        this.isAuthenticated$.next(true);
      }
    }
  }

  login(email: string, password: string): boolean {
    const user = this.userService.findUser(email, password);
    if (user) {
      localStorage.setItem('auth', JSON.stringify(user));
      this.authUser$.next(user);
      this.isAuthenticated$.next(true);
      return true;
    }
    this.popupService.open('Error', 'Invalid email or password');
    return false;
  }

  logout(): void {
    localStorage.removeItem('auth');
    this.isAuthenticated$.next(false);
    this.authUser$.next(null);
  }
}
