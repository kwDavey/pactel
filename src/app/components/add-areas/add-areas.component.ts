import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-add-areas',
  templateUrl: './add-areas.component.html',
  styleUrls: ['./add-areas.component.css']
})
export class AddAreasComponent implements OnInit {

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router) { }

  Area= "";
  Province = "";

  Provinces = [""];

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      //this.GetGroupsData(params.get('ID'));
    });


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
    await(this.dbService.AddArea(this.Area, this.Province,).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Area Added");
        this.Reset();
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  Reset(){
    this.Area = "";
    this.Province = "";
  }

  Back(){
    this.router.navigate(['ViewArea']); 
  }
}
