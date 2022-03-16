import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public Username = "";
  public Password = "";

  constructor(private dbService: SqlService,private router: Router,private modalService: NgbModal) { }


  ngOnInit(): void {
  }


  async Login(){
    
    if(this.Username.length < 6 || this.Password.length<6){
        this.PopupTitle = "Invalid Details"
        this.DisplayErrormessage = "Please check your details and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
    }else{
      await(this.dbService.LogUserIn(this.Username, this.Password).subscribe((ret) => {
        if(ret != "false"){
          //alert("Logged in");
          this.dbService.DidUserLogInSuccessfully(ret as string,true);
          this.router.navigate(['ScanBox']); 
        }else{
          this.dbService.DidUserLogInSuccessfully("",false);
          this.PopupTitle = "Invalid Details"
          this.DisplayErrormessage = "Please check your details and try again";
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
        }
      }));
    }

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
