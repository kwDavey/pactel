import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-view-providers',
  templateUrl: './view-providers.component.html',
  styleUrls: ['./view-providers.component.css']
})
export class ViewProvidersComponent implements OnInit {

  SearchValue = "";
  
  data = [
    {
      ID:"Cell C",
      BoxSize:"100",
      BatchSize: "3"
    }];

  constructor(private dbService: SqlService,private router: Router) { }

  ngOnInit(): void {
  }


  EditData(AreaID:string){
    this.router.navigate(['/EditProviders', AreaID]);
  }
  
  Add(){
    this.router.navigate(['/AddProviders']);
  }

  ClearSearch(){
    this.SearchValue = "";
  }

  
}
