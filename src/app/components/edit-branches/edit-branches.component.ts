import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-edit-branches',
  templateUrl: './edit-branches.component.html',
  styleUrls: ['./edit-branches.component.css']
})
export class EditBranchesComponent implements OnInit {

  BranchName = "";

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router) { }

  ngOnInit(): void {
  }

  Delete(){

  }

  Save(){

  }

  Reset(){

  }

  Back(){
    this.router.navigate(['ViewBranches']); 
  }

}
