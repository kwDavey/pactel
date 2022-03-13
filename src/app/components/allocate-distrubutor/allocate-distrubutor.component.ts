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

          if(elementtemp[2] == "1"){
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
        alert("Please check your connection and try again");
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

    await(this.dbService.AllocateDistributor(formData).subscribe((ret:any) => {
      if(ret != "false"){ 

        
     
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "A Distributor has been set.";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();

      }else{

       

        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your internet connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();

      }



    }));
  }


  Revert(){
    //**********************************************************************************************
    //Go back to "In Prep" stage"
    //**********************************************************************************************
  }

  

  Print(){
    //**********************************************************************************************
    //Print out distrubutor sheet
    //**********************************************************************************************
    var title = 'Box Number: CJA1458679';
    
    var setup = [
      ["Distributor"],
      ["Date"],
      ["Branch"],
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

    var originalNum = 21;
    var maxnum = originalNum;
    var topNumber = Math.floor(maxnum/2);

    if(maxnum% 2 != 0){
      //Odd
      maxnum++;
    }

    
   
    for (let index = 1; index <= maxnum; index++) {
      topNumber++;
      console.log("HI");
      var strRow = [""];
      if((originalNum)% 2 != 0){
        //Odd

        if(index == 1){
          topNumber++;
        }

        
        if(index== maxnum-1){
          strRow = [numberToString(index)," "," "," "];
        }else{
          strRow = [numberToString(index)," ",numberToString(topNumber)," "];
        }

        
      }else{
        strRow = [numberToString(index)," ",numberToString(topNumber)," "];
      }
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

      row.height = 40;

      maxnum--;
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

}
