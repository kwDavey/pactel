import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import * as XLSX from 'xlsx';

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { createOfflineCompileUrlResolver } from '@angular/compiler';

type AOA = any[][];

@Component({
  selector: 'app-scan-box',
  templateUrl: './scan-box.component.html',
  styleUrls: ['./scan-box.component.css']
})
export class ScanBoxComponent implements OnInit {

  StageOne = true;

  Provider = 0;

  ProvidersData = [
    {
      ID:"",
      BoxSize: "",
      BatchSize: ""
    }];


  Branch = "";
  Branchs = [""];

  date = "";

  excelFile = "";

  SERIALNUMBERs = [""];
  BoxNUMBERs = [""];
  DataDisplay = [{BoxNum:"",SerialNum:""}];
  BoxNumber = "";

  formData = new FormData(); // Currently empty
  data: AOA = [[1, 2], [3, 4]];

  ImportValid = false;

  closeResult = '';
  DisplayErrormessage = "";
  PopupTitle = "";

  CurrentDate = "";

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    let tempDate = new Date();
    this.CurrentDate = tempDate.getFullYear() + "-";
    if(tempDate.getMonth().toString().length == 1){
      this.CurrentDate += "0" + tempDate.getMonth()  + "-";
    }else{
      this.CurrentDate += tempDate.getMonth() + "-";
    }

    if(tempDate.getDay().toString().length == 1){
      this.CurrentDate += "0" + tempDate.getDay();
    }else{
      this.CurrentDate += tempDate.getDay();
    }

    this.getData();
    this.ImportValid = false;
  }

  async getData(){
   
    await(this.dbService.getAllProviders().subscribe((ret:any) => {
      if(ret != "false"){
        this.ProvidersData.splice(0);
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          let elementtemp = element.split(",")
          let temp = { ID:elementtemp[0],
                        BoxSize: elementtemp[1],
                        BatchSize:elementtemp[2]
                      }

          this.ProvidersData.push(temp);
        });

      }else{
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
    }));

    await(this.dbService.GetAllBranches().subscribe((ret:any) => {
      if(ret != "false"){
        this.Branchs.splice(0);
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          this.Branchs.push(element);
        });
      }else{
       
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
    }));
  }

  

  
  

  onFileChange(event: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
     

      

      this.ValidateImport();

    };
    reader.readAsBinaryString(target.files[0]);
  }

  ValidateImport(){
    //console.log(this.data[0][0]);//Box Number?
    //console.log(this.data[0][1]);//SERIAL NUMBER

    if(this.data[0][0] == undefined || this.data[0][0] == undefined){
      this.excelFile = "";
  
      this.PopupTitle = "Error"
      this.DisplayErrormessage = "Please make sure the first row contains the headings";
      let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
      element.click();
    }else{
      if((this.data[0][0] as string).toUpperCase() != "BOX NUMBER"){
        this.excelFile = "";
  
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please make sure the FIRST colomn has Box numbers in it and the heading is:'BOX NUMBER'";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
      if((this.data[0][1] as string).toUpperCase() != "SERIAL NUMBER"){
        this.excelFile = "";
  
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please make sure the SECOND colomn has Serial Numbers in it and the heading is:'SERIAL NUMBER'";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
    }

   

   
    var tempString = "";
    var tempBoxDetailsString = "";
    this.SERIALNUMBERs.splice(0);
    this.BoxNUMBERs.splice(0);
    this.DataDisplay.splice(0);

    this.BoxNumber = this.data[1][0];
    let temp = this.ProvidersData[this.Provider];

    for (let index = 1; index < this.data.length; index++) {
      //`Boxno`, `Serialno`, `Batchno`, `Client`, `DateDist`
      tempString = tempString + " ('"+this.data[index][0]+"','"+this.data[index][1]+"','','','"+this.date + "') ,";
      this.SERIALNUMBERs.push(this.data[index][1] as string);


      if(!(this.BoxNUMBERs.includes(this.data[index][0]))){
        this.BoxNUMBERs.push(this.data[index][0]);
        tempBoxDetailsString += "('"+this.data[index][0]+"','"+temp.ID+"','"+temp.BoxSize+"','"+temp.BatchSize+"','"+this.date +"','','"+this.Branch+"','','' ),";
      }

      this.DataDisplay.push({
        BoxNum:this.data[index][0],
        SerialNum:this.data[index][1]
      });
    }


    tempString = "INSERT INTO `BoxDetails`(`Boxno`, `Serialno`, `Batchno`, `Client`, `DateDist`) VALUES" + tempString.substr(0,tempString.length-1) + " ; ";
    this.formData.set("SQL", tempString);


    tempString = "INSERT INTO `Boxes`(`Boxno`, `Provider`, `Boxsize`, `Batchsize`, `DateReceived`, `Status`, `Branch`, `Distributor`, `Province`) VALUES" + tempBoxDetailsString.substr(0,tempBoxDetailsString.length-1) + " ; ";
    console.log("Error");
    this.formData.set("SQL2", tempString);
    
    this.ImportValid = true;
  }

  Next(){
   this.StageOne = false;
  }

  Back(){
    this.StageOne = true;
  }

  Reset(){
    this.Provider = 0;
    this.Branch = "";
    this.date = "";
    this.excelFile = "";
  }

  async Done(){
    await(this.dbService.AddNewBox(this.formData).subscribe((ret:any) => {
      if(!(String(ret).includes("Error"))){
        this.router.navigate(['PrepareBatches']); 
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "The Box has been added";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }else{
        //"Error.Duplicate entry 'Box1-1' for key 'PRIMARY'"
        
        if(String(ret).includes("Duplicate entry")){
          let tepError = String(ret).replace("Error.","");
          tepError = tepError.replace(" for key 'PRIMARY'","") + "(Serial Number)";

          this.PopupTitle = "Invalid Details"
          this.DisplayErrormessage = tepError ;
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
        }else{
          this.PopupTitle = "Error"
          this.DisplayErrormessage = "Please check your internet connection and try again";
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
        }
      }
    }));
  }



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

}
