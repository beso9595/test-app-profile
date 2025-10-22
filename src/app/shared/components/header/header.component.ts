import { Component } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    MatButtonModule,
    NgOptimizedImage,
  ],
  standalone: true
})
export class HeaderComponent {
  constructor() {
  }
}
