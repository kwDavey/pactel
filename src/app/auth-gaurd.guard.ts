import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import {SqlService} from './Database/sql.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGaurdGuard implements CanActivate {

  constructor(private router: Router,private dbService: SqlService) { }


  /*canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }*/

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //this.dbService.isUserLoggedIn(); // returns true if user logged-in otherwise returns false


    if (this.dbService.isUserLoggedIn()) {
        // logged in so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: {  }});
    return false;
}
  
}
