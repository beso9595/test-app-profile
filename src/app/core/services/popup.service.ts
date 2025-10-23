import { Injectable } from '@angular/core';
import { PopupComponent } from "../../shared/components/popup/popup.component";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog) { }

  open(title = '', message = ''): void {
    this.dialog.open(PopupComponent, {
      data: { title, message }
    });
  }
}
