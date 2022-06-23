import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prepare-batches',
  templateUrl: './prepare-batches.component.html',
  styleUrls: ['./prepare-batches.component.css']
})
export class PrepareBatchesComponent implements OnInit {

  BoxNumber = "";

  closeResult = '';
  DisplayErrormessage = "";
  PopupTitle = "";

  firstscreen = true;
  Secondscreen = false;

  AllSerialBatchnumbers = [{}];
  AllSerialnumbers = [""];
  NewSerialnumbers = [""];
  AllocatedSerialnumbers = [""];

  Boxsize = 0;
  Batchsize = 0;
  status = "";
  CurrentBatch = 0;

  InputSerialNumber = [""];

  ConfirmReset = "";

  PossibleBoxNumbers = [""];
  PossibleBoxNumbersMain = [""];
  PossibleBox = "";

  forceClose = false;

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.GetAllBoxNames();
  }

  PossibleBoxChanged(){
    this.BoxNumber = this.PossibleBox[0];
  }

  Back(){
    this.firstscreen = true;
    this.Secondscreen = false;
  }

  BoxNameChanged(){
    this.PossibleBoxNumbers.splice(0);

    for (let index = 0; index < this.PossibleBoxNumbersMain.length; index++) {
      if(this.PossibleBoxNumbersMain[index].indexOf(this.BoxNumber) > -1){
        this.PossibleBoxNumbers.push(this.PossibleBoxNumbersMain[index]);
      }
      
    }
  }

  async GetAllBoxNames(){
    this.PossibleBoxNumbers.splice(0);
    this.PossibleBoxNumbersMain.splice(0);

    var formData = new FormData(); // Currently empty
    formData.set("Where", " Status = 'Recieved' OR Status = 'In Prep' ");


    await(this.dbService.getAllBoxesNames(formData).subscribe((ret:any) => {
      if(ret != "false"){
       
        let a = (ret as string).split(';');

        this.PossibleBoxNumbersMain = a;

        a.forEach(element => {
          this.PossibleBoxNumbers.push(element);
        });

       
      }else{
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your internet connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
    }));
  }


  async Next(){
    this.CurrentBatch = 0;

    await(this.dbService.GetBoxDetails(this.BoxNumber).subscribe((ret:any) => {
      if(ret != "false"){
        this.InputSerialNumber.splice(0);
        this.NewSerialnumbers.splice(0);
        this.AllSerialBatchnumbers.splice(0);
        this.AllSerialnumbers.splice(0);
        this.AllocatedSerialnumbers.splice(0);

        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        let firsttemp = a[0].split(",");
        this.Boxsize = Number.parseInt(firsttemp[0]);
        this.Batchsize = Number.parseInt(firsttemp[1]);
        this.status = firsttemp[2];
        //Branch

        if(this.status == "Prepped" || this.status == "Allocated"){
          this.PopupTitle = "Success"
          this.DisplayErrormessage = "This Box has been prepped already";
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
          this.router.navigate(['AllocateDistributor']); 
        }else{
          a.splice(0,1);

          a.forEach(element=> {
            let secondtemp = element.split(",");
            let temp = {
              SerialNumber: secondtemp[0],
              BatchNo: secondtemp[1]
            }
  
            if(secondtemp[4] == this.BoxNumber){
              if( Number.parseInt(secondtemp[1]) > this.CurrentBatch){
                this.CurrentBatch = Number.parseInt(secondtemp[1]);
              }
  
              if(Number.parseInt(secondtemp[1]) > 0 ){
                this.AllocatedSerialnumbers.push(secondtemp[0]);
              }

              this.AllSerialnumbers.push(secondtemp[0]);
              this.AllSerialBatchnumbers.push(temp);
            }
  
          });
  
  
          this.firstscreen = false;
          this.Secondscreen = true;
          this.CurrentBatch+=1;
        }

        
      }else{
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your internet connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
    }));
  }


  Reset(){
    this.BoxNumber = "";

    this.InputSerialNumber.splice(0);
    this.NewSerialnumbers.splice(0);
    this.AllSerialBatchnumbers.splice(0);
    this.AllSerialnumbers.splice(0);
    this.AllocatedSerialnumbers.splice(0);

    this.firstscreen = true;
    this.Secondscreen = false;
  }

  ResetBatch(){
    this.InputSerialNumber.splice(0);
  }


  NextBatch(){

    var bvalid = true;
    var count = 0;
    this.InputSerialNumber.forEach(element => {
      if(element == undefined || element == null){
        bvalid = false;
        
      }else{
        count++;
      }
    });

    if(bvalid != true || count != this.Batchsize){
      this.PopupTitle = "Error"
      this.DisplayErrormessage = "Please fill in all serial numbers";
      let element: HTMLButtonElement = document.getElementById('ErrorButtonConstant') as HTMLButtonElement;
      element.click();
    }else{


      var bSerialsValid = true;
      var errorMessage = ""; 

      this.InputSerialNumber.forEach(InputSerialNumberEl => {

        if(this.AllSerialnumbers.includes(InputSerialNumberEl)){
          
          if(this.AllocatedSerialnumbers.includes(InputSerialNumberEl)){
            bSerialsValid = false;
            errorMessage = "One of these serial numbers have been allocated a batch already(" + InputSerialNumberEl + ")";
          }else{

            if(this.NewSerialnumbers.includes(InputSerialNumberEl)){
              bSerialsValid = false;
              errorMessage = "There are duplicated serial numbers in this batch(" + InputSerialNumberEl + ")";
            }else{
              
              this.NewSerialnumbers.push(InputSerialNumberEl);
            }
          }
        }else{
          bSerialsValid = false;
          errorMessage = "This serial number does not exsist in the box(" + InputSerialNumberEl + ")";
        }
      });

      if(bSerialsValid != true){
        this.NewSerialnumbers.splice(0);
        this.PopupTitle = "Error"
        this.DisplayErrormessage = errorMessage;
        let element: HTMLButtonElement = document.getElementById('ErrorButtonConstant') as HTMLButtonElement;
        element.click();
      }else{


        if((this.InputSerialNumber.length + this.AllocatedSerialnumbers.length) < this.Boxsize){
          this.NewSerialnumbers.splice(0);
          this.PopupTitle = "Success"
          this.DisplayErrormessage = "End of Batch number:" + this.CurrentBatch;
          let element: HTMLButtonElement = document.getElementById('ErrorButtonConstant') as HTMLButtonElement;
          element.click();
  
          
        }

        this.SaveBatch();
        
      }

    }
  }

  async SaveBatch(){
    

    var formData = new FormData(); // Currently empty

    var sql = "";
    
    this.InputSerialNumber.forEach(element => {

      sql += "UPDATE [Pactel].[dbo].[BoxDetails]  SET Boxno='"+this.BoxNumber+"',Batchno='"+this.CurrentBatch+"' WHERE Serialno ='" +element+ "';";
    });
  
  

    sql+= "UPDATE [Pactel].[dbo].[Boxes] SET Status='In Prep' WHERE Boxno='" +this.BoxNumber +"';"
    formData.set("SQL", sql);

    await(this.dbService.AddNewBatch(formData).subscribe((ret:any) => {
      if(ret != "false"){ 

  
        if((this.InputSerialNumber.length + this.AllocatedSerialnumbers.length) >= this.Boxsize){

          this.FinanilizeAllBatches();

        }else{

          if(this.forceClose == true){
            this.FinanilizeAllBatches();
          }else{
            this.ResetBatch();
            this.Next();
          }
          
        }
      }else{
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your internet connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }



    }));

    
  }

  async FinanilizeAllBatches(){
    var formData = new FormData(); // Currently empty  Prepped
    formData.set("BoxNumber", this.BoxNumber);

    //Display another screen, to say all batches are done. Change status to 'Prepped', and go to the Allocate Distributor
    await(this.dbService.FinanilizeAllBatches(formData).subscribe((ret:any) => {
      if(ret != "false"){ 

        this.PopupTitle = "Success"
        this.DisplayErrormessage = "All Serial numbers are assigned to a batch.";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();

        this.router.navigate(['AllocateDistributor']); 

      }else{
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your internet connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();

      }
    }));

  }


  ResetBox(){
    this.ConfirmReset = "";
    this.PopupTitle = "Warning!"
    this.DisplayErrormessage = "Please type in 'RESET' below to RESET the whole the box.";
    let element: HTMLButtonElement = document.getElementById('btnConfirmReset') as HTMLButtonElement;
    element.click();
  }

  async ActuallyResetBox(){
    var formData = new FormData(); // Currently empty  Prepped
    formData.set("BoxNumber", this.BoxNumber);

    await(this.dbService.ClearBoxBatches(formData).subscribe((ret:any) => {
      if(ret != "false"){ 

        
     
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "All batches have been reset.";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();

        this.ResetBatch();
        this.Reset();

      }else{

       

        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your internet connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();

      }



    }));
  }

  openConfirmReset(content: any) {
    this.modalService.open(content,
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
         if(this.ConfirmReset == "RESET"){
          this.ActuallyResetBox();
         }
    }, (reason) => {
      this.closeResult = 
         'Dismissed ${this.getDismissReason(reason)}';
    });
  }


  ForceClose(){

    this.ConfirmReset = "";
    this.PopupTitle = "Warning!"
    this.DisplayErrormessage = "Please type in 'DONE' below to FORCE close the box.";
    let element: HTMLButtonElement = document.getElementById('btnConfirmClose') as HTMLButtonElement;
    element.click();
  } 


  openConfirmForceClose(content: any) {
    this.modalService.open(content,
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult ='Closed with: ${result}';

         if(this.ConfirmReset == "DONE"){
          this.forceClose = true;
          this.SaveBatch();
         }
    }, (reason) => {
      this.closeResult = 
         'Dismissed ${this.getDismissReason(reason)}';
    });
  }
  

  open(content: any) {
    this.modalService.open(content,
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = 
         'Dismissed ${this.getDismissReason(reason)}';
      //let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
      //element.click();
    });
  }

  open2(content: any) {
    this.modalService.open(content,
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = 
        ' Dismissed ${this.getDismissReason(reason)}';
      let element: HTMLButtonElement = document.getElementById('ErrorButtonConstant') as HTMLButtonElement;
      element.click();
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return 'with: ${reason}';
    }
  }

}
