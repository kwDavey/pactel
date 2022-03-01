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
  OldBranchName = "";

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.BranchName = params.get('ID') as string;
      this.OldBranchName = params.get('ID') as string;
    });
  }


  
  async Delete(){
    await(this.dbService.DeleteBranches(this.BranchName).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Branch has been deleted");
        this.Back();
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  async Save(){
    await(this.dbService.EditBranches(this.OldBranchName, this.BranchName).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Branch has been editted");
        this.Back();
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  Reset(){
    this.route.paramMap.subscribe(params => {
      this.BranchName = params.get('ID') as string;
      this.OldBranchName = params.get('ID') as string;
    });
  }

  Back(){
    this.router.navigate(['ViewBranches']); 
  }

}
