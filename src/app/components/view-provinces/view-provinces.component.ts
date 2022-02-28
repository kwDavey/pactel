import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SqlService } from "../../Database/sql.service";

@Component({
  selector: 'app-view-provinces',
  templateUrl: './view-provinces.component.html',
  styleUrls: ['./view-provinces.component.css']
})
export class ViewProvincesComponent implements OnInit {

  SearchValue = "";
  
  data = [
    {
      ID: "Gauteng"
    }];

  constructor(private dbService: SqlService, private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
    await(this.dbService.getAllProvinces().subscribe((ret:any) => {
      if(ret != false){
        this.data.splice(0);
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element => {
          let temp = {ID: element};
          this.data.push(temp);
        });

        

        
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }


  EditData(AreaID: string) {
    //this.router.navigate(['/EditProvince', AreaID]);
  }

  ClearSearch(){
    this.SearchValue = "";
  }





}
