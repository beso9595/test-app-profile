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
    const auth = localStorage.getItem('auth');
    if (auth) {
      const user = JSON.parse(auth) as User;
      if (this.userService.getUser(user.id)) {
        this.isAuthenticated$.next(true);
        this.authUser$.next(JSON.parse(auth));
      }
    }
    this.authUser$.subscribe((user) => {
      if (user) {
        localStorage.setItem('auth', JSON.stringify(user));
      } else {
        localStorage.removeItem('auth');
      }
    });
  }

  login(email: string, password: string): boolean {
    const user = this.userService.findUser(email, password);
    if (user) {
      this.authUser$.next(user);
      this.isAuthenticated$.next(true);
      return true;
    }
    this.popupService.open('Error', 'Invalid email or password');
    return false;
  }

  logout(): void {
    this.isAuthenticated$.next(false);
    this.authUser$.next(null);
  }
}
