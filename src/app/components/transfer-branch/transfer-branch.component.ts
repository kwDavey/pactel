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
    formData.set("Where", " true ");


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
