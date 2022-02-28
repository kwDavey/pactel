import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-add-distributors',
  templateUrl: './add-distributors.component.html',
  styleUrls: ['./add-distributors.component.css']
})
export class AddDistributorsComponent implements OnInit {

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router) { }

  DistributorsName= "";
  Province = "";
  Active = "";
  Provinces = [""];

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


  async Save(){
    await(this.dbService.AddDistrubutor(this.DistributorsName, this.Province, this.Active).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Distributor Added");
        this.Reset();
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
