import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit {

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router) { }

  Username= "";
  Password = "";
  ConfirmPassword = "";
  Rights = "User";

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
    });

  }


  async Save(){
    if(this.Username.length < 6 || this.Password.length<6|| this.Password != this.ConfirmPassword){
      alert("Please check your details and try again");
    }else{
      await(this.dbService.AddUser(this.Username, this.Password, this.Rights).subscribe((ret:any) => {
        if(ret != "false"){
          alert("User Added");
          this.Reset();
        }else{
          alert("Please check your connection and try again");
        }
      }));
    }
  }

  Reset(){
    this.Username= "";
    this.Password = "";
    this.ConfirmPassword = "";
    this.Rights = "User";
  }

  Back(){
    this.router.navigate(['ViewUsers']); 
  }


}
