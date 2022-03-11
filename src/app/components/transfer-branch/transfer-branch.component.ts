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

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getData();
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
