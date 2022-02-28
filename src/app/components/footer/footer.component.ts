import { Component, OnInit } from '@angular/core';

import {SqlService} from '../../Database/sql.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {


  constructor(private dbService: SqlService) { }

  ngOnInit(): void {
    
  }

  isLoggedIn(): Boolean{
    return this.dbService.isUserLoggedIn();
  }


  Logout(){
    this.dbService.Logout();
  }
}
