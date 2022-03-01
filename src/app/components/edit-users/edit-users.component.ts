import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.css']
})
export class EditUsersComponent implements OnInit {

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router) { }

  Username= "";
  OldUsername= "";
  Password = "";
  ConfirmPassword = "";
  Rights = "User";

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.getData(params.get('ID'));
    });

  }

  async getData(ID:any){
   


    await(this.dbService.GetSpecificUser(ID).subscribe((ret:any) => {
      if(ret != "false"){
      
        let a = (ret as string).split(',');

        this.Username = a[0];
        this.OldUsername = a[0];
        this.Password = a[1];
        this.ConfirmPassword = a[1];
        this.Rights = a[2];

      }else{
        alert("Please check your connection and try again");
      }
    }));
  }


  async Delete(){
    await(this.dbService.DeleteUser(this.Username).subscribe((ret:any) => {
      if(ret != "false"){
        alert("User has been deleted");
        this.Back();
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  async Save(){
    if(this.Username.length < 6 || this.Password.length<6 || this.Password != this.ConfirmPassword){
      alert("Please check your details and try again");
    }else{
      await(this.dbService.EditUser(this.OldUsername, this.Username, this.Password, this.Rights).subscribe((ret:any) => {
        if(ret != "false"){
          alert("User has been editted");
          this.Back();
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
