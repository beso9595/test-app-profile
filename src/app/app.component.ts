import { Component } from '@angular/core';
import { HelperService } from "./core/services/helper.service";
import { UserService } from "./core/services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test-app-profile';
  loader = true;

  constructor(
    private helperService: HelperService,
    private userService: UserService
  ) {
    this.helperService.loader$.subscribe(v => this.loader = v);
    //
    this.userService.loadData();
  }
}
