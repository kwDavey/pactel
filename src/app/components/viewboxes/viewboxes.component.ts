import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-viewboxes',
  templateUrl: './viewboxes.component.html',
  styleUrls: ['./viewboxes.component.css']
})
export class ViewboxesComponent implements OnInit {

  SearchValue = "";
  
  data = [
    {
    }];

  constructor(private dbService: SqlService,private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
   
    await(this.dbService.getAllBoxes().subscribe((ret:any) => {
      if(ret != "false"){
        this.data.splice(0);
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          let elementtemp = element.split(",")
          let temp = {
                        Boxno:elementtemp[0],
                        Provider:elementtemp[1],
                        Boxsize:elementtemp[2],
                        Batchsize:elementtemp[3],
                        DateReceived:elementtemp[4],
                        Status:elementtemp[5],
                        Branch:elementtemp[6],
                        Distributor:elementtemp[7],
                         Province:elementtemp[8],
                      }
          this.data.push(temp);
        });
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }


  ViewData(AreaID:string){
    this.router.navigate(['/ViewSpecificBox', AreaID]);
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
