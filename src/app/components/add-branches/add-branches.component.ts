import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";


@Component({
  selector: 'app-add-branches',
  templateUrl: './add-branches.component.html',
  styleUrls: ['./add-branches.component.css']
})
export class AddBranchesComponent implements OnInit {

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
