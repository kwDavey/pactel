import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";


@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {

  ClientName = "";
  Province = "";
  Area = "";

  Provinces = [""];
  Areas = [""];

  OldClientName = "";
  
  

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.getData(params.get('ID'));
    });
    
  }

  async getData(ID:any){
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


    await(this.dbService.GetSpecificClients(ID).subscribe((ret:any) => {
      if(ret != "false"){
      
        let a = (ret as string).split(',');

        this.ClientName = a[0];
        this.OldClientName = a[0];
        this.Province = a[1];
        this.ProvinceChanged();
        this.Area = a[2];

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
  

  Reset(){
    this.ClientName =""; 
    this.Province="";
    this.Area="";
    this.Areas.splice(0);
  }

  Back(){
    this.router.navigate(['ViewClient']); 
  }


 
  async Delete(){
    await(this.dbService.DeleteClient(this.ClientName).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Client has been deleted");
        this.Back();
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  async Save(){
    await(this.dbService.EditClient(this.OldClientName, this.ClientName, this.Province, this.Area).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Client has been editted");
        this.Back();
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  

}
