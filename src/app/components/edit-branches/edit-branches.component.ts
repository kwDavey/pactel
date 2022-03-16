import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-edit-branches',
  templateUrl: './edit-branches.component.html',
  styleUrls: ['./edit-branches.component.css']
})
export class EditBranchesComponent implements OnInit {

  BranchName = "";
  OldBranchName = "";

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.BranchName = params.get('ID') as string;
      this.OldBranchName = params.get('ID') as string;
    });
  }


  
  async Delete(){
    await(this.dbService.DeleteBranches(this.BranchName).subscribe((ret:any) => {
      if(!(String(ret).includes("Error"))){
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "Branch has been deleted";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
        this.Back();
      }else{
        this.PopupTitle = "Something went wrong"
        this.DisplayErrormessage = "Something went wrong, please try again. If this continuies please contact the I.T Department";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
    }));
  }

  async Save(){
    await(this.dbService.EditBranches(this.OldBranchName, this.BranchName).subscribe((ret:any) => {
      if(!(String(ret).includes("Error"))){
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "Branch has been editted";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
        this.Back();
      }else{

        if(String(ret).includes("Duplicate entry")){
          this.PopupTitle = "Invalid Details"
          this.DisplayErrormessage = "This Branch already exists";
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
        }else{
          this.PopupTitle = "Something went wrong"
          this.DisplayErrormessage = "Something went wrong, please try again. If this continuies please contact the I.T Department";
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
        }
      }
    }));
  }

  Reset(){
    this.route.paramMap.subscribe(params => {
      this.BranchName = params.get('ID') as string;
      this.OldBranchName = params.get('ID') as string;
    });
  }

  Back(){
    this.router.navigate(['ViewBranches']); 
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

}
