import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  authUser$ = new BehaviorSubject<User | null>(null);

  constructor() { }
}
