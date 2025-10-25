import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "../../shared/components/card/card.component";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  delay,
  finalize,
  interval,
  of,
  Subject,
  Subscription,
  take,
  takeUntil,
} from "rxjs";
import { MatRadioModule } from "@angular/material/radio";
import { HelperService } from "../../core/services/helper.service";
import { UserService } from "../../core/services/user.service";
import { PopupService } from "../../core/services/popup.service";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";
import { UserFormComponent } from "../../shared/components/user-form/user-form.component";
import { UserForm } from "../../core/models/user-form";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule, CardComponent, MatButtonModule, UserFormComponent, MatRadioModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnDestroy {
  destroy$ = new Subject();
  mode: 'registration' | 'choose-verify-type' | 'verify' = 'registration';
  title = 'Registration';
  width = '400px';
  form!: UserForm;
  verificationType = new FormControl('email');
  verificationCode = new FormControl('');
  timerSub: Subscription | null = null;
  minutes = 0;
  seconds = 0;
  timerOngoing = false;
  disableVerify = true;

  constructor(
    private helperService: HelperService,
    private userService: UserService,
    private popupService: PopupService,
    private authService: AuthService,
    private router: Router,
  ) {}

  onRegistration(form: UserForm): void {
    if (this.userService.checkEmail(form.email)) {
      this.popupService.open('Warning', `Email: ${form.email} is already taken`);
      return;
    } else {
      this.form = form;
      this.setChooseVerifyTypeMode();
    }
  }

  setChooseVerifyTypeMode(): void {
    this.helperService.loader$.next(true);
    of('').pipe(delay(1000)).subscribe(() => { // simulate loading
      this.mode = 'choose-verify-type';
      this.title = 'Verification type';
      this.helperService.loader$.next(false);
    });
  }

  setVerifyMode(): void {
    this.helperService.loader$.next(true);
    of('').pipe(delay(1000)).subscribe(() => { // simulate loading
      this.mode = 'verify';
      this.title = 'Verify';
      this.startCountDown();
      this.verificationCode.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(v => {
        this.disableVerify = !(v && v.toString().length === 6);
      });

      this.helperService.loader$.next(false);
    });
  }

  onSendAgain(): void {
    if (this.timerOngoing) {
      return;
    }
    this.helperService.loader$.next(true);
    of('').pipe(delay(1000)).subscribe(() => { // simulate loading
      this.startCountDown();
      this.helperService.loader$.next(false);
    });
  }

  startCountDown(): void {
    this.minutes = 2;
    this.seconds = 0;
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
    const allSeconds = 120;
    this.timerOngoing = true;
    this.timerSub = interval(1000).pipe(
      take(allSeconds + 1),
      finalize(() => this.timerOngoing = false)
    ).subscribe((v) => {
      const left = allSeconds - v;
      this.minutes = Math.floor(left/60);
      this.seconds = left - (this.minutes * 60);
    });
  }

  onVerify(): void {
    this.helperService.loader$.next(true);
    of('').pipe(delay(1000)).subscribe(() => { // simulate loading
      this.save();
      this.helperService.loader$.next(false);
    });
  }

  private save(): void {
    this.userService.addUser(this.form);
    this.popupService.open('Success', `User successfully registered`);
    const result = this.authService.login(this.form.email, this.form.password);
    if (result) {
      this.router.navigate(['profile']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
