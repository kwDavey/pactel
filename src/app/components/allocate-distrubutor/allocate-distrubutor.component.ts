import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

import * as fs from 'file-saver';

import { Workbook } from 'exceljs';
import { numberToString } from 'pdf-lib';

@Component({
  selector: 'app-allocate-distrubutor',
  templateUrl: './allocate-distrubutor.component.html',
  styleUrls: ['./allocate-distrubutor.component.css']
})
export class AllocateDistrubutorComponent implements OnInit {

  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';


  closeResult = '';
  DisplayErrormessage = "";
  PopupTitle = "";
  ConfirmReset = "";

  BoxNumber = "";

  Distributor = "";
  Distributors = [""];

  Province = "";
  Provinces = [""];

  data = [
    {
      ID:"",
      Province: "",
      Active:""

    }];


  branch = "";
  Batchsize = 10;
  Boxsize = 100;
  Status = "";

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getAllData();
  }

  Reset(){
    this.Province = "";
    this.BoxNumber = "";
    this.Distributor = "";

    this.Distributors.splice(0);
  }

  ProvinceChanged(){
    this.Distributors.splice(0);
    this.data.forEach(element => {
      if(element.Province == this.Province){
        this.Distributors.push(element.ID);
      }
    });
  }

  async getAllData(){
    await(this.dbService.getAllDistrubutor().subscribe((ret:any) => {
      if(ret != "false"){
        this.Distributors.splice(0);
        this.Provinces.splice(0);
        this.data.splice(0);

        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          let elementtemp = element.split(",")

          if(elementtemp[2] == "Yes"){
            let temp = { ID:elementtemp[0],
              Province: elementtemp[1],
              Active:elementtemp[2]
            }

            this.data.push(temp);
            if(!(this.Provinces.includes(elementtemp[1]))){
              this.Provinces.push(elementtemp[1]);
            }
          
          }
         
                
          
        });
      }else{
       
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your internet connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
    }));
  }


  async Save(){
    //**********************************************************************************************
    //Validate that the box has been Prepped
    //**********************************************************************************************

    var formData = new FormData(); // Currently empty  Prepped
    formData.set("BoxNumber", this.BoxNumber);
    formData.set("Distributor", this.Distributor);
    formData.set("Province", this.Province);

    let tempDate = new Date();
    let tempStringDate = "";
    tempStringDate = tempDate.getFullYear() + "-";
    if(tempDate.getMonth().toString().length == 1){
      tempStringDate += "0" + tempDate.getMonth()  + "-";
    }else{
      tempStringDate += tempDate.getMonth() + "-";
    }

    if(tempDate.getDay().toString().length == 1){
      tempStringDate += "0" + tempDate.getDay();
    }else{
      tempStringDate += tempDate.getDay();
    }

    formData.set("Date", tempStringDate);

    await(this.dbService.AllocateDistributor(formData).subscribe((ret:any) => {
      console.log(ret);
      if(!(ret.toString().includes("false"))){ 

        
     
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "A Distributor has been set.";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();

      }else{

        if(ret == "false, status incorrect"){
          this.DisplayErrormessage = "The status of this box is not 'prepped'";
        }else{
          this.DisplayErrormessage = "Please check your internet connection and try again";
        }

        this.PopupTitle = "Error"
        
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();

      }



    }));
  }

  RevertCheck(){
    this.ConfirmReset = "";
    this.PopupTitle = "Warning!"
    this.DisplayErrormessage = "Please type in 'YES' below to revert the box.";
    let element: HTMLButtonElement = document.getElementById('btnConfirmReset') as HTMLButtonElement;
    element.click();
  }


  async Revert(){
    var formData = new FormData(); // Currently empty  Prepped
    formData.set("BoxNumber", this.BoxNumber);

    await(this.dbService.ClearBoxBatches(formData).subscribe((ret:any) => {
      if(ret != "false"){ 

        
     
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "All batches have been reset.";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();

        this.router.navigate(['PrepareBatches']); 

      }else{

       

        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your internet connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();

      }



    }));
  }

  async Print(){
    await(this.dbService.GetBoxDetails(this.BoxNumber).subscribe((ret:any) => {
      if(ret != "false"){ 

        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        let firsttemp = a[0].split(",");
        this.Boxsize = Number.parseInt(firsttemp[0]);
        this.Batchsize = Number.parseInt(firsttemp[1]);
        this.Status = firsttemp[2];
        this.branch = firsttemp[3];
        
        if(this.Status == "Prepped" || this.Status == "Allocated"){
          this.PrintSheet();
        }else{

          this.PopupTitle = "Error"
          this.DisplayErrormessage = "Box has invalid status:'" + this.Status +"', when it should be 'Prepped' OR 'Allocated'"; 
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
        }
        

      }else{

       

        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your internet connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();

      }



    }));
  }

  PrintSheet(){
    //**********************************************************************************************
    //Print out distrubutor sheet
    //**********************************************************************************************
    var title = 'Box Number: '+ this.BoxNumber;

    let tempDate = new Date();
    let tempStringDate = "";
    tempStringDate = tempDate.getFullYear() + "-";
    if(tempDate.getMonth().toString().length == 1){
      tempStringDate += "0" + tempDate.getMonth()  + "-";
    }else{
      tempStringDate += tempDate.getMonth() + "-";
    }

    if(tempDate.getDay().toString().length == 1){
      tempStringDate += "0" + tempDate.getDay();
    }else{
      tempStringDate += tempDate.getDay();
    }

    var setup = [
      ["Distributor",this.Distributor],
      ["Date",tempStringDate],
      ["Branch",this.branch],
      ["Area"]

    ]


    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Distributor sheet');

    worksheet.columns = [
      { width: 15 },
      { width: 30 },
      { width: 10 },
      { width: 30 },
    ];



   
    

    var originalNum = this.Boxsize;
    var maxnum = originalNum;
    var topNumber = Math.floor(maxnum/2);

    if(maxnum% 2 != 0){
      //Odd
      maxnum++;
    }

    
   
      

      for (let index = 1; index <= maxnum; index++) {


        if(index == 1 || (index-1) % 30 ==0){
          // Add new row
          let titleRow = worksheet.addRow([title]);
            
          // Set font, size and style in title row.
          titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
            
          setup.forEach(element => {

            let row =  worksheet.addRow(element);
      
            row.getCell(1).border = {
              top: { style: 'thin' }, 
              left: { style: 'thin' }, 
              bottom: { style: 'thin' }, 
              right: { style: 'thin' }
            }
      
            row.getCell(2).border = {
              top: { style: 'thin' }, 
              left: { style: 'thin' }, 
              bottom: { style: 'thin' }, 
              right: { style: 'thin' }
            }
      
            row.getCell(1).font = { name: 'Comic Sans MS', family: 4, size: 16};
            row.getCell(2).font = { name: 'Comic Sans MS', family: 4, size: 16};
      
          });
        }


        topNumber++;
        var strRow = [""];
        if((originalNum)% 2 != 0){
          //Odd

          if(index == 1){
            topNumber++;
          }

          
          if(index== maxnum-1){
            strRow = [numberToString(index)," "," "," "];
          }else{
            strRow = [numberToString(index)," ",numberToString(index+1)," "];
          }

          
        }else{
          strRow = [numberToString(index)," ",numberToString(index+1)," "];
        }
        index++;
        let row = worksheet.addRow(strRow);
        

        row.getCell(1).border = {
          top: { style: 'thin' }, 
          left: { style: 'thin' }, 
          bottom: { style: 'thin' }, 
          right: { style: 'thin' }
        }

        row.getCell(2).border = {
          top: { style: 'thin' }, 
          left: { style: 'thin' }, 
          bottom: { style: 'thin' }, 
          right: { style: 'thin' }
        }

        row.getCell(3).border = {
          top: { style: 'thin' }, 
          left: { style: 'thin' }, 
          bottom: { style: 'thin' }, 
          right: { style: 'thin' }
        }

        row.getCell(4).border = { 
          top: { style: 'thin' }, 
          left: { style: 'thin' }, 
          bottom: { style: 'thin' }, 
          right: { style: 'thin' }
        }

        row.getCell(1).font = { name: 'Comic Sans MS', family: 4, size: 16};
        row.getCell(2).font = { name: 'Comic Sans MS', family: 4, size: 16};
        row.getCell(3).font = { name: 'Comic Sans MS', family: 4, size: 16};
        row.getCell(4).font = { name: 'Comic Sans MS', family: 4, size: 16};

        row.height = 30;
      }
    
   
      




    






    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Export.xlsx');
    })

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


  openConfirmReset(content: any) {
    this.modalService.open(content,
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
         if(this.ConfirmReset == "YES"){
          this.Revert();
         }
    }, (reason) => {
      this.closeResult = 
         `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
