import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transfer-branch',
  templateUrl: './transfer-branch.component.html',
  styleUrls: ['./transfer-branch.component.css']
})
export class TransferBranchComponent implements OnInit {

  BoxNumber = "";

  Branch = "";
  Branchs = [""];

  closeResult = '';
  DisplayErrormessage = "";
  PopupTitle = "";


  PossibleBoxNumbers = [""];
  PossibleBoxNumbersMain = [""];
  PossibleBox = "";
  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getData();

    this.GetAllBoxNames();
  }

  PossibleBoxChanged(){
    this.BoxNumber = this.PossibleBox[0];
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
    formData.set("Where", " 1=1 ");


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


  async getData(){
    
    await(this.dbService.GetAllBranches().subscribe((ret:any) => {
      if(ret != "false"){
        this.Branchs.splice(0);
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          this.Branchs.push(element);
        });
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  async Save(){
    await(this.dbService.TransferBranch(this.BoxNumber,this.Branch).subscribe((ret:any) => {
      if(ret != "false"){
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "The Box has been transferred";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        this.Reset();
        element.click();
      }else{
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your internet connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
    }));
  }

  ConfirmReset = "";


  Delete(){
    this.ConfirmReset = "";
    this.PopupTitle = "Warning!"
    this.DisplayErrormessage = "Please type in 'DELETE' below to DELETE the whole the box.";
    let element: HTMLButtonElement = document.getElementById('btnConfirmReset') as HTMLButtonElement;
    element.click();
  }


  formData = new FormData(); // Currently empty
  async ActuallyDeleteBox(){


    this.formData.set("SQL2", "Delete [Pactel].[dbo].[Boxes] where BoxNo ='" + this.BoxNumber + "'; ");

    this.formData.set("SQL", "Delete [Pactel].[dbo].[BoxDetails] where BoxNo ='" + this.BoxNumber + "'; ");

    await(this.dbService.DeleteBox(this.formData).subscribe((ret:any) => {
      if(!(String(ret).includes("Error"))){
        this.router.navigate(['PrepareBatches']); 
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "The Box has been deleted";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }else{
        //"Error.Duplicate entry 'Box1-1' for key 'PRIMARY'"

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
         if(this.ConfirmReset == "DELETE"){
          this.ActuallyDeleteBox();
         }
    }, (reason) => {
      this.closeResult = 
         'Dismissed ${this.getDismissReason(reason)}';
    });
  }

  Reset(){
    this.BoxNumber = "";
    this.Branch = "";
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
