import { Component, OnDestroy } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { User } from "../../core/models/user";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../../core/services/auth.service";
import { Subject, takeUntil } from "rxjs";
import countries from "../../shared/data/country-list";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { UserDialogComponent } from "../../shared/components/user-dialog/user-dialog.component";
import { GLOBAL } from "../../shared/data/global";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    CardComponent,
    MatButtonModule,
    MatIconModule,
    DatePipe
  ],
  standalone: true
})
export class ProfileComponent implements OnDestroy {
  destroy$ = new Subject<void>();
  user!: User;
  countryName!: string;
  phoneNumber!: string;

  defaultAvatar = GLOBAL.DEFAULT_AVATAR;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {
    this.authService.authUser$.pipe(takeUntil(this.destroy$)).subscribe(u => {
      this.user = u || {} as User;
      if (this.user) {
        if (this.user.countryCode) {
          const find = countries.find(c => c.code === this.user.countryCode);
          if (find) {
            this.countryName = find.name;
            this.phoneNumber = find.phone_index + ' ' + this.user.phone;
          }
        }
      }
    });
    //
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['edit'] === 'true') {
        setTimeout(() => {
          this.onEditClick();
        }, 500);
      }
    });
  }

  onEditClick(): void {
    this.dialog.open(UserDialogComponent, {
      panelClass: 'user-dialog-pc',
      data: {
        user: this.user
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
