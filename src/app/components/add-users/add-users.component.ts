import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit {

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  closeResult = '';
  DisplayErrormessage = "";
  PopupTitle = "";
  
  Username= "";
  Password = "";
  ConfirmPassword = "";
  Rights = "User";

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
    });

  }


  async Save(){

    if(this.Username.length < 6){
      this.DisplayErrormessage = "The Username must be at least six(6) charachters long";
    }else if(this.Username.length < 6){
      this.DisplayErrormessage = "The Password must be at least six(6) charachters long";
    }else if(this.Password != this.ConfirmPassword){
      this.DisplayErrormessage = "The passwords do not match";
    }



    if(this.Username.length < 6 || this.Password.length<6|| this.Password != this.ConfirmPassword){
      this.PopupTitle = "Something seems to have gone wrong"
      let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
      element.click();
    }else{
      await(this.dbService.AddUser(this.Username, this.Password, this.Rights).subscribe((ret:any) => {
        if(ret != "false"){
          this.PopupTitle = "Success"
          this.DisplayErrormessage = "The User has been added";
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
          this.Reset();
        }else{
          this.PopupTitle = "Something seems to have gone wrong"
          this.DisplayErrormessage = "Please check your connection and try again";
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
        }
      }));
    }
  }

  Reset(){
    this.Username= "";
    this.Password = "";
    this.ConfirmPassword = "";
    this.Rights = "User";
  }

  Back(){
    this.router.navigate(['ViewUsers']); 
  }


  open(content: any) {
    console.log("HI");
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
