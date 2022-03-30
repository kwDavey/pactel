import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-specific-box',
  templateUrl: './view-specific-box.component.html',
  styleUrls: ['./view-specific-box.component.css']
})//GetBoxDetails
export class ViewSpecificBoxComponent implements OnInit {

  SearchValue = "";
  
  AllSerialBatchnumbers = [{}];


  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.getData(params.get('ID'));
    });
  }

  async getData(ID:any){
   
    await(this.dbService.GetBoxDetails(ID).subscribe((ret:any) => {
      if(ret != "false"){ 
        this.AllSerialBatchnumbers.splice(0);

        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        let firsttemp = a[1].split(",");
        //this.Boxsize = Number.parseInt(firsttemp[0]);
        ///this.Batchsize = Number.parseInt(firsttemp[1]);
        //this.Status = firsttemp[2];
        //this.branch = firsttemp[3];
        //this.Province = firsttemp[4];
        a.splice(0,1);

        a.forEach(element=> {
          let secondtemp = element.split(",");
          let temp = {
            SerialNumber: secondtemp[0],
            BatchNo: secondtemp[1],
            Client: secondtemp[2],
            DateDist: secondtemp[3]
          }
          this.AllSerialBatchnumbers.push(temp);
        });

       

  
      }else{
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your box number try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
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
    let targetTableElm = document.getElementById("tblDataExport");
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: "Report" });
    XLSX.writeFile(wb, `Report.xlsx`);
  }



  closeResult = '';
  DisplayErrormessage = "";
  PopupTitle = "";
  open(content: any) {
    console.log("HI");
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
}
