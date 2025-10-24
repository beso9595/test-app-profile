import { Component, OnDestroy } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { User } from "../../core/models/user";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../../core/services/auth.service";
import { Subject, takeUntil } from "rxjs";
import countries from "../../shared/data/country-list";
import { DatePipe } from "@angular/common";

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
  height = '400px';
  countryName!: string;
  phoneNumber!: string;

  constructor(private authService: AuthService) {
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
