import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {

  SearchValue = "";
  

  data = [
    {
      ID:"kwdavey",
      Rights:"Manager",
    }];

  constructor(private dbService: SqlService,private router: Router) { }

  ngOnInit(): void {
  }


  EditData(AreaID:string){
    this.router.navigate(['/EditUsers', AreaID]);
  }
  
  Add(){
    this.router.navigate(['/AddUsers']);
  }

  ClearSearch(){
    this.SearchValue = "";
  }

}
