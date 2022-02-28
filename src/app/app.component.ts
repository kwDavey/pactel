import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import {SqlService} from './Database/sql.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pactel';

  public isUserLoggedIn: Boolean | undefined;

  constructor(private dbService: SqlService) {}

  ngOnInit() {
    this.isUserLoggedIn = this.dbService.isUserLoggedIn(); // returns true if user logged-in otherwise returns false
  }

  isLoggedIn(): boolean {
    return this.dbService.isUserLoggedIn();
  }
}
