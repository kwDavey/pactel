import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-edit-distributors',
  templateUrl: './edit-distributors.component.html',
  styleUrls: ['./edit-distributors.component.css']
})
export class EditDistributorsComponent implements OnInit {

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router) { }

  DistributorsName= "";
  OldDistributorsName = "";
  Province = "";
  Active = "";
  Provinces = [""];

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

    await(this.dbService.GetSpecificDistrubutor(ID).subscribe((ret:any) => {
      if(ret != "false"){
      
        let a = (ret as string).split(',');

        this.DistributorsName = a[0];
        this.OldDistributorsName = a[0];
        this.Province = a[1];
        this.Active = a[2];

      }else{
        alert("Please check your connection and try again");
      }
    }));
  }


  async Delete(){
    await(this.dbService.DeleteDistrubutor(this.DistributorsName).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Distributor has been deleted");
        this.Back();
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  async Save(){
    await(this.dbService.EditDistrubutor(this.OldDistributorsName, this.DistributorsName, this.Province, this.Active).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Distributor has been editted");
        this.Back();
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  Reset(){
    this.DistributorsName= "";
    this.Province = "";
    this.Active = "";
  }

  Back(){
    this.router.navigate(['ViewDistributors']); 
  }

}
