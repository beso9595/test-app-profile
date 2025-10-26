import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatOptionModule } from "@angular/material/core";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import {
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from "rxjs";
import { MatIconModule } from "@angular/material/icon";
import { Country } from "../../../core/models/country";
import countries from "../../data/country-list";
import { GLOBAL } from "../../data/global";
import { User } from "../../../core/models/user";
import { UserForm } from "../../../core/models/user-form";

const passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
};

function imageSizeExceed(): ValidatorFn {
  return () => ({ imageSizeExceed: true });
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatAutocompleteModule, MatButtonModule, MatDatepickerModule,
    MatFormFieldModule, MatIconModule, MatInputModule, MatOptionModule, ReactiveFormsModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnDestroy {
  @Input() mode!: 'registration' | 'update';
  @Input() user!: User;
  @Output() submit = new EventEmitter<UserForm>();
  destroy$ = new Subject();

  width = '400px';
  form!: FormGroup;
  minDate = new Date((new Date()).getFullYear() - 100, 0, 1);
  maxDate = new Date((new Date()).getFullYear() - 18, 11, 31);
  filteredOptions!: Observable<Country[]>;
  countryList: Country[] = countries;
  fileName = '';
  selectedFile?: File;
  imageUploadSize = GLOBAL.IMAGE_UPLOAD_SIZE
  btnNames = {
    'registration': "Sign up",
    'update': "Update",
  }

  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      id: new FormControl((new Date()).getTime().toString()),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null),
      confirmPassword: new FormControl(null),
      username: new FormControl(null, Validators.required),
      birthdate: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
      countryCode: new FormControl(null),
      countryPhoneIndex: new FormControl({value: null, disabled: true}, Validators.required),
      phone: new FormControl(null, Validators.required),
      website: new FormControl(null),
      avatar: new FormControl(null),
    }, { validators: passwordMatchValidator });
    //
    if (this.mode === 'registration') {
      this.form.get('password')?.addValidators(Validators.required);
      this.form.get('confirmPassword')?.addValidators(Validators.required);
    } else if (this.mode === 'update') {
      this.assignData();
      //
      this.form.get('email')?.disable();
      this.form.get('country')?.disable();
      //
      this.form.addControl('newPassword', new FormControl(null));
    }
    //
    const control = this.form.get('country')!;
    this.filteredOptions = control.valueChanges.pipe(
      takeUntil(this.destroy$),
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  assignData(): void {
    const country = this.countryList.find(c => c.code === this.user.countryCode);
    this.form.patchValue({
      id: this.user.id,
      email: this.user.email,
      username: this.user.username,
      birthdate: this.user.birthdate,
      country: country?.name,
      countryCode: country?.code,
      countryPhoneIndex: country?.phone_index,
      phone: this.user.phone,
      website: this.user.website,
      avatar: this.user.avatar,
    });
    if (this.user.avatar) {
      this.fileName = 'avatar';
    }
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
      this.fileName = this.selectedFile?.name || '';
      const kbs = parseInt((file.size / 1024).toFixed(1), 10);
      if (kbs > (this.imageUploadSize * 1000)) {
        this.form.get('avatar')?.setValidators(imageSizeExceed());
      } else {
        this.form.get('avatar')?.clearValidators();
      }
      this.form.get('avatar')?.updateValueAndValidity();
      this.form.updateValueAndValidity();
      this.form.markAsDirty();
    }
  }

  onFileClear(): void {
    if (this.fileName) {
      this.form.markAsDirty();
    }
    this.selectedFile = undefined;
    this.fileName = '';
    this.form.get('avatar')?.setValue(null);
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.get('avatar')?.setValue(reader.result as string);
        this._submit();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this._submit();
    }
  }

  private _submit(): void {
    this.submit.emit(this.form.getRawValue());
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
