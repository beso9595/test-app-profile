import { Injectable } from '@angular/core';
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private data: User[] = [];
  private secretWord = 'qa384gabk478tg';

  constructor() { }

  loadData(): void {
    this.data = JSON.parse(localStorage.getItem('users') || '[]');
  }

  getUser(id: string): User | null {
    const find = this.data.find((u) => u.id === id);
    return find || null;
  }

  checkEmail(email: string): boolean {
    const find = this.data.find((u) => u.email === email);
    return !!find;
  }

  findUser(email: string, password: string): User | false {
    const hashedPass = password + this.secretWord; // simulating hashing
    const find = this.data.find((u) => (u.email === email && u.password === hashedPass));
    return find || false;
  }

  addUser(user: User): void {
    user.password = user.password + this.secretWord; // simulating hashing
    this.data.push(user);
    this.updateDB();
  }

  updateUser(user: User): void {
    this.data = this.data.map((u) => {
      if (u.id === user.id) {
        return user;
      }
      return u;
    });
    this.updateDB();
  }

  private updateDB(): void {
    localStorage.setItem('users', JSON.stringify(this.data));
  }
}
