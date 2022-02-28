import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-view-branches',
  templateUrl: './view-branches.component.html',
  styleUrls: ['./view-branches.component.css']
})
export class ViewBranchesComponent implements OnInit {

  SearchValue="";
  
  data = [
    {
      ID:"Northworld CellC",
    }];

  constructor(private dbService: SqlService,private router: Router) { }

  ngOnInit(): void {
  }

  EditData(AreaID:string){
    this.router.navigate(['/EditBranches', AreaID]);
  }

  Add(){
    this.router.navigate(['/AddBranches']);
  }

  ClearSearch(){
    this.SearchValue = "";
  }
}
