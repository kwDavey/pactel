import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {
  ClientName = "";
  Province = "";
  Area = "";

  Provinces = [""];
  Areas = [""];
  

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
   
    await(this.dbService.getAllProvinces().subscribe((ret:any) => {
      if(ret != "false"){
        this.Provinces.splice(0);
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          this.Provinces.push(element);
        });
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  async ProvinceChanged(){
    this.Area="";
    await(this.dbService.getAreaPerProvince(this.Province).subscribe((ret:any) => {
      this.Areas.splice(0);
      if(ret != "false"){
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          this.Areas.push(element);
        });
      }else{
        //alert("Please check your connection and try again");
      }
    }));
  }


  async Save(){
    await(this.dbService.AddClient(this.ClientName, this.Province, this.Area).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Client Added");
        this.Reset();
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  Reset(){
    this.ClientName =""; 
    this.Province="";
    this.Area="";
    this.Areas.splice(0);
  }

  Back(){
    this.router.navigate(['ViewClient']); 
  }
}
