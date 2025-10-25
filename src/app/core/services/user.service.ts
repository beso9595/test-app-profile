import { Injectable } from '@angular/core';
import { User } from "../models/user";
import { UserForm } from "../models/user-form";

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
    const user = this.getById(id);
    if (user) {
      return {
        ...user,
        password: ''
      }
    }
    return null;
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

  addUser(userForm: UserForm): void {
    const { country, countryPhoneIndex, ...user } = userForm;
    this.data.push({
      ...user,
      password: user.password + this.secretWord // simulating hashing
    });
    this.commitDB();
  }

  updateUser(userForm: UserForm): User {
    const nPassword = this.checkNewPassword(userForm);
    const { country, countryPhoneIndex, confirmPassword, newPassword, ...user } = userForm;
    if (nPassword) {
      user.password = nPassword;
    }
    this.data = this.data.map((u) => {
      if (u.id === user.id) {
        return user;
      }
      return u;
    });
    this.commitDB();
    return user;
  }

  private getById(id: string): User | null {
    const find = this.data.find((u) => u.id === id);
    return find || null;
  }

  private checkNewPassword(userForm: UserForm): string {
    if (userForm.password && userForm.confirmPassword && userForm.newPassword) {
      const user = this.getById(userForm.id);
      if (user && user.password === (userForm.password + this.secretWord)) {
        return userForm.newPassword + this.secretWord;
      } else {
        throw new Error('Incorrect password');
      }
    }
    return '';
  }

  private commitDB(): void {
    localStorage.setItem('users', JSON.stringify(this.data));
  }
}
