import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";
@Component({
  selector: 'app-view-areas',
  templateUrl: './view-areas.component.html',
  styleUrls: ['./view-areas.component.css']
})
export class ViewAreasComponent implements OnInit {

  SearchValue = "";

  data = [
          {
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          },{
            ID:"Northworld",
            Province:"Gauteng"
          }];

  constructor(private dbService: SqlService,private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
   
    await(this.dbService.getAllAreas().subscribe((ret:any) => {
      if(ret != "false"){
        this.data.splice(0);
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          let elementtemp = element.split(",")
          let temp = { ID:elementtemp[0],
                        Province: elementtemp[1]
                      }
          this.data.push(temp);
        });
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }


  EditData(AreaID:string){
    this.router.navigate(['/EditArea', AreaID]);
  }

  Add(){
    this.router.navigate(['/AddArea']);
  }

  ClearSearch(){
    this.SearchValue = "";
  }

}
