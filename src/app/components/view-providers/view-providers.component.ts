import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-view-providers',
  templateUrl: './view-providers.component.html',
  styleUrls: ['./view-providers.component.css']
})
export class ViewProvidersComponent implements OnInit {

  SearchValue = "";
  
  data = [
    {
    }];

  constructor(private dbService: SqlService,private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
   
    await(this.dbService.getAllProviders().subscribe((ret:any) => {
      if(ret != "false"){
        this.data.splice(0);
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          let elementtemp = element.split(",")
          let temp = { ID:elementtemp[0],
                        BoxSize: elementtemp[1],
                        BatchSize:elementtemp[2]
                      }
          this.data.push(temp);
        });
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }


  EditData(AreaID:string){
    this.router.navigate(['/EditProviders', AreaID]);
  }
  
  Add(){
    this.router.navigate(['/AddProviders']);
  }

  ClearSearch(){
    this.SearchValue = "";
  }

  btnDownloadReportClickExcel(){
    /* generate worksheet */
    let targetTableElm = document.getElementById("tblData");
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: "Report" });
    XLSX.writeFile(wb, `Report.xlsx`);
  }
}
