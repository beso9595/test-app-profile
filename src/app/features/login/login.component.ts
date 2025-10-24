import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "../../shared/components/card/card.component";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { delay, of } from "rxjs";
import { HelperService } from "../../core/services/helper.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  title = 'Login';
  width = '400px';
  form: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private helperService: HelperService,
  ) {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
  }

  onLogin(): void {
    this.helperService.loader$.next(true);
    of('').pipe(delay(1000)).subscribe(() => { // simulate loading
      this.helperService.loader$.next(false);
      //
      const { email, password } = this.form.value;
      const result = this.authService.login(email, password);
      if (result) {
        this.router.navigate(['profile']);
      }
    });
  }
}
