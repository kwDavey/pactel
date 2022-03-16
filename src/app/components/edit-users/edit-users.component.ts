import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.css']
})
export class EditUsersComponent implements OnInit {

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  closeResult = '';
  DisplayErrormessage = "";
  PopupTitle = "";

  Username= "";
  OldUsername= "";
  Password = "";
  ConfirmPassword = "";
  Rights = "User";

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.getData(params.get('ID'));
    });

  }

  async getData(ID:any){
   


    await(this.dbService.GetSpecificUser(ID).subscribe((ret:any) => {
      if(ret != "false"){
      
        let a = (ret as string).split(',');

        this.Username = a[0];
        this.OldUsername = a[0];
        this.Password = a[1];
        this.ConfirmPassword = a[1];
        this.Rights = a[2];

      }else{
        alert("Please check your connection and try again");
      }
    }));
  }


  async Delete(){
    await(this.dbService.DeleteUser(this.Username).subscribe((ret:any) => {
      if(!(String(ret).includes("Error"))){
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "The User has been deleted";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
        this.Back();
      }else{
        this.PopupTitle = "Something seems to have gone wrong"
        this.DisplayErrormessage = "Please check your connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
    }));
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
      await(this.dbService.EditUser(this.OldUsername, this.Username, this.Password, this.Rights).subscribe((ret:any) => {
        if(!(String(ret).includes("Error"))){
          this.PopupTitle = "Success"
          this.DisplayErrormessage = "The User's details have been changed";
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
          this.Back();
        }else{
          if(String(ret).includes("Duplicate entry")){
            this.PopupTitle = "Invalid Details"
            this.DisplayErrormessage = "This Username already exists";
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
