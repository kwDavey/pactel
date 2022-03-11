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

  BoxNumber = "CJA1458679";

  closeResult = '';
  DisplayErrormessage = "";
  PopupTitle = "";

  firstscreen = true;
  Secondscreen = false;

  AllSerialBatchnumbers = [{}];
  AllSerialnumbers = [0];
  NewSerialnumbers = [0];
  AllocatedSerialnumbers = [1,4];

  Boxsize = 0;
  Batchsize = 0;
  status = "";
  CurrentBatch = 0;

  InputSerialNumber = [1,4];

  ConfirmReset = "";

  forceClose = false;

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
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

        if(this.status == "Prepped" || this.status == "Allocated"){
          this.PopupTitle = "Success"
          this.DisplayErrormessage = "This Box has been prepped already";
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
          this.router.navigate(['AllocateDistributor']); 
        }

        a.splice(0,1);

        a.forEach(element=> {
          let secondtemp = element.split(",");
          let temp = {
            SerialNumber: secondtemp[0],
            BatchNo: secondtemp[1]
          }
          if( Number.parseInt(secondtemp[1]) > this.CurrentBatch){
            this.CurrentBatch = Number.parseInt(secondtemp[1]);
          }

          if(Number.parseInt(secondtemp[1]) > 0 ){
            this.AllocatedSerialnumbers.push(Number.parseInt(secondtemp[0]));
          }
          this.AllSerialnumbers.push(Number.parseInt(secondtemp[0]));
          this.AllSerialBatchnumbers.push(temp);
        });

        this.firstscreen = false;
        this.Secondscreen = true;
        this.CurrentBatch+=1;
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

    if((this.InputSerialNumber.length) != this.Batchsize){
      this.PopupTitle = "Error"
      this.DisplayErrormessage = "Please fill in all serial numbers";
      let element: HTMLButtonElement = document.getElementById('ErrorButtonConstant') as HTMLButtonElement;
      element.click();
    }else{


      var bSerialsValid = true;
      var errorMessage = ""; 

      this.InputSerialNumber.forEach(element => {

        if(this.AllSerialnumbers.includes(element)){

          if(this.AllocatedSerialnumbers.includes(element)){
            bSerialsValid = false;
            errorMessage = "One of these serial numbers have been allocated a batch already(" + element + ")";
          }else{

            if(this.NewSerialnumbers.includes(element)){
              bSerialsValid = false;
              errorMessage = "There are duplicated serial numbers in this batch(" + element + ")";
            }else{
              
              this.NewSerialnumbers.push(element);
            }
          }
        }else{
          bSerialsValid = false;
          errorMessage = "This serial number does not exsist in the box(" + element + ")";
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

      sql += "UPDATE `BoxDetails` SET `Batchno`='"+this.CurrentBatch+"' WHERE Serialno = '" +element+ "';";
    });
  
  

    sql+= "UPDATE `Boxes` SET `Status`='In Prep' WHERE Boxno='" +this.BoxNumber +"';"
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
    this.DisplayErrormessage = "Please type in 'RESET' below to reset the box.";
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
      this.closeResult = `Closed with: ${result}`;
         if(this.ConfirmReset == "RESET"){
          this.ActuallyResetBox();
         }
    }, (reason) => {
      this.closeResult = 
         `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  ForceClose(){

    this.ConfirmReset = "";
    this.PopupTitle = "Warning!"
    this.DisplayErrormessage = "Please type in 'DONE' below to reset the box.";
    let element: HTMLButtonElement = document.getElementById('btnConfirmClose') as HTMLButtonElement;
    element.click();
  }


  openConfirmForceClose(content: any) {
    this.modalService.open(content,
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

         if(this.ConfirmReset == "DONE"){
          this.forceClose = true;
          this.SaveBatch();
         }
    }, (reason) => {
      this.closeResult = 
         `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  open2(content: any) {
    this.modalService.open(content,
   {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = 
         `Dismissed ${this.getDismissReason(reason)}`;
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
      return `with: ${reason}`;
    }
  }

}
