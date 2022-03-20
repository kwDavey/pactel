import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {

  SearchValue = "";
  

  data = [{}];

  constructor(private dbService: SqlService,private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
    await(this.dbService.getAllUsers().subscribe((ret:any) => {
      if(ret != false){
        this.data.splice(0);
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element => {
          let elementtemp = element.split(",")
          let temp = {ID: elementtemp[0],
                      Rights: elementtemp[1]};
          this.data.push(temp);
        });

        

        
      }else{
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
    }));
  }


  EditData(AreaID:string){
    this.router.navigate(['/EditUsers', AreaID]);
  }
  
  Add(){
    this.router.navigate(['/AddUsers']);
  }

  ClearSearch(){
    this.SearchValue = "";
  }



  closeResult = '';
  DisplayErrormessage = "";
  PopupTitle = "";
  open(content: any) {
    this.modalService.open(content,
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = 
         `Dismissed ${this.getDismissReason(reason)}`;
      //let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
      //element.click();
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  btnDownloadReportClickExcel(){
    /* generate worksheet */
    let targetTableElm = document.getElementById("tblData");
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: "Report" });
    XLSX.writeFile(wb, `Report.xlsx`);
  }


}
