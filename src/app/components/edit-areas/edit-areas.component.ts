import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-edit-areas',
  templateUrl: './edit-areas.component.html',
  styleUrls: ['./edit-areas.component.css']
})
export class EditAreasComponent implements OnInit {

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router) { }

  Area= "";
  OldArea= "";
  Province = "";

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


    await(this.dbService.GetSpecificArea(ID).subscribe((ret:any) => {
      if(ret != "false"){
      
        let a = (ret as string).split(',');

        this.Area = a[0];
        this.OldArea = a[0];
        this.Province = a[1];

      }else{
        alert("Please check your connection and try again");
      }
    }));
  }



  
  async Delete(){
    await(this.dbService.DeleteArea(this.Area).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Area has been deleted");
        this.Back();
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  async Save(){
    await(this.dbService.EditArea(this.OldArea, this.Area, this.Province).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Area has been editted");
        this.Back();
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
