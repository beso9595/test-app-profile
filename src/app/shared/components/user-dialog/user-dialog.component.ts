import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { User } from "../../../core/models/user";
import { MatIconModule } from "@angular/material/icon";
import { UserFormComponent } from "../user-form/user-form.component";
import { UserForm } from "../../../core/models/user-form";
import { MatFormFieldModule } from "@angular/material/form-field";
import { UserService } from "../../../core/services/user.service";
import { PopupService } from "../../../core/services/popup.service";
import { AuthService } from "../../../core/services/auth.service";
import { delay, of } from "rxjs";
import { HelperService } from "../../../core/services/helper.service";

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, UserFormComponent, MatFormFieldModule],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent {

  constructor(
    private userService: UserService,
    private popupService: PopupService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {}

  onUpdate(userForm: UserForm): void {
    this.helperService.loader$.next(true);
    of('').pipe(delay(1000)).subscribe(() => { // simulate loading
      this.helperService.loader$.next(false);
      //
      try {
        const updatedUser = this.userService.updateUser(userForm);
        this.authService.authUser$.next(updatedUser);
        this.popupService.open('Success', `User successfully updated`);
        this.dialogRef.close();
      } catch (e) {
        if (e instanceof Error) {
          this.popupService.open('Error', e.message);
        } else {
          this.popupService.open('Error', 'Unknown error');
        }
      }
    });
  }
}
