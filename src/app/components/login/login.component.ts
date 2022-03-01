import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public Username = "";
  public Password = "";

  constructor(private dbService: SqlService,private router: Router) { }


  ngOnInit(): void {
  }


  async Login(){
    
    if(this.Username.length < 6 || this.Password.length<6){
      alert("Please check your details and try again");
    }else{
      await(this.dbService.LogUserIn(this.Username, this.Password).subscribe((ret) => {
        if(ret != "false"){
          //alert("Logged in");
          this.dbService.DidUserLogInSuccessfully(ret as string,true);
          this.router.navigate(['ScanBox']); 
        }else{
          this.dbService.DidUserLogInSuccessfully("",false);
          alert("Please check your details and try again");
        }
      }));
    }

  }
}
