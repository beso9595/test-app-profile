import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "../../shared/components/card/card.component";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import {
  delay,
  finalize,
  interval,
  map,
  Observable,
  of,
  startWith,
  Subject,
  Subscription,
  take,
  takeUntil,
} from "rxjs";
import { Country } from "../../core/models/country";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";
import { HelperService } from "../../core/services/helper.service";
import { UserService } from "../../core/services/user.service";
import { PopupService } from "../../core/services/popup.service";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";
import countries from "../../shared/data/country-list";
import { GLOBAL } from "../../shared/data/global";

function imageSizeExceed(): ValidatorFn {
  return () => ({ imageSizeExceed: true  });
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule, CardComponent, MatButtonModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule, MatDatepickerModule,
    MatNativeDateModule, MatAutocompleteModule,
    MatIconModule, MatRadioModule
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnDestroy {
  destroy$ = new Subject();
  mode: 'registration' | 'choose-verify-type' | 'verify' = 'registration';
  title = 'Registration';
  width = '400px';
  form: FormGroup;
  maxDate = new Date((new Date()).getFullYear() - 18, 11, 31);
  filteredOptions: Observable<Country[]>;
  countryList: Country[] = countries;
  selectedFile?: File;
  verificationType = new FormControl('email');
  verificationCode = new FormControl('');
  timerSub: Subscription | null = null;
  minutes = 0;
  seconds = 0;
  timerOngoing = false;
  disableVerify = true;
  imageUploadSize = GLOBAL.IMAGE_UPLOAD_SIZE

  constructor(
    private helperService: HelperService,
    private userService: UserService,
    private popupService: PopupService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = new FormGroup({
      id: new FormControl(crypto.randomUUID()),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      birthdate: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
      countryCode: new FormControl(null),
      countryPhoneIndex: new FormControl({ value: null, disabled: true }, Validators.required),
      phone: new FormControl(null, [Validators.required, Validators.pattern('')]),
      website: new FormControl(null),
      avatar: new FormControl(null),
    });
    //
    const control = this.form.get('country')!;
    this.filteredOptions = control.valueChanges.pipe(
      takeUntil(this.destroy$),
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: Country | string): Country[] {
    const filterValue = (typeof value === 'object' ? value.name : value).toLowerCase();
    return this.countryList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  onCountrySelect(event: MatAutocompleteSelectedEvent) {
    const selected = event.option.value;
    this.form.patchValue({
      country: selected.name,
      countryCode: selected.code,
      countryPhoneIndex: selected.phone_index
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const kbs = parseInt((file.size/ 1024).toFixed(1), 10);
      if (kbs > (this.imageUploadSize * 1000)) {
        this.form.get('avatar')?.setValidators(imageSizeExceed());
      } else {
        this.form.get('avatar')?.clearValidators();
      }
      this.form.get('avatar')?.updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }

  onRegistration(): void {
    if (this.userService.checkEmail(this.form.get('email')?.value)) {
      this.popupService.open('Warning', `Email: ${this.form.get('email')?.value} is already taken`);
      return;
    }
    //
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        this.form.get('avatar')?.setValue('Base64:' + base64Image);
        this.setChooseVerifyTypeMode();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
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
    const { country, countryPhoneIndex, ...user } = this.form.getRawValue();
    this.userService.addUser({...user});
    this.popupService.open('Success', `User successfully registered`);
    const result = this.authService.login(user.email, user.password);
    if (result) {
      this.router.navigate(['profile']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
