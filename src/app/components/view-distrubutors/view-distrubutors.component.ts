import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-view-distrubutors',
  templateUrl: './view-distrubutors.component.html',
  styleUrls: ['./view-distrubutors.component.css']
})
export class ViewDistrubutorsComponent implements OnInit {

  SearchValue = "";

  data = [
    {}];

  constructor(private dbService: SqlService,private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
   
    await(this.dbService.getAllDistrubutor().subscribe((ret:any) => {
      if(ret != "false"){
        this.data.splice(0);
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          let elementtemp = element.split(",")
          let temp = { ID:elementtemp[0],
                        Province: elementtemp[1],
                        Active:elementtemp[2]
                      }
          this.data.push(temp);
        });
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }


  EditData(AreaID:string){
    this.router.navigate(['/EditDistributors', AreaID]);
  }


  Add(){
    this.router.navigate(['/AddDistributors']);
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
