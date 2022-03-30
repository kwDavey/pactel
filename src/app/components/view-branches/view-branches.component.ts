import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-view-branches',
  templateUrl: './view-branches.component.html',
  styleUrls: ['./view-branches.component.css']
})
export class ViewBranchesComponent implements OnInit {

  SearchValue="";
  
  data = [
    {
      ID:"Northworld CellC",
    }];

    p: number = 1;
    ItemsPerPage = 20;

  constructor(private dbService: SqlService,private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
   
    await(this.dbService.GetAllBranches().subscribe((ret:any) => {
      if(ret != "false"){
        this.data.splice(0);
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          let temp = { ID:element };
          this.data.push(temp);
        });
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  EditData(AreaID:string){
    this.router.navigate(['/EditBranches', AreaID]);
  }

  Add(){
    this.router.navigate(['/AddBranches']);
  }

  ClearSearch(){
    this.SearchValue = "";
  }

  btnDownloadReportClickExcel(){
    /* generate worksheet */
    let targetTableElm = document.getElementById("tblDataExport");
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: "Report" });
    XLSX.writeFile(wb, `Report.xlsx`);
  }
}
