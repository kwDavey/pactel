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
  

  data = [{}];

  constructor(private dbService: SqlService,private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
    await(this.dbService.getAllUsers().subscribe((ret:any) => {
      if(ret != false){
        this.data.splice(0);
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element => {
          let elementtemp = element.split(",")
          let temp = {ID: elementtemp[0],
                      Rights: elementtemp[1]};
          this.data.push(temp);
        });

        

        
      }else{
        alert("Please check your connection and try again");
      }
    }));
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
