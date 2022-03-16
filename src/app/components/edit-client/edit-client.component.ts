import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {

  ClientName = "";
  Province = "";
  Area = "";

  Provinces = [""];
  Areas = [""];

  OldClientName = "";
  
  

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.getData(params.get('ID'));
    });
    
  }

  async getData(ID:any){
    await(this.dbService.getAllProvinces().subscribe((ret:any) => {
      if(ret != "false"){
        this.Provinces.splice(0);
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          this.Provinces.push(element);
        });
      }else{
        this.PopupTitle = "Something went wrong"
          this.DisplayErrormessage = "Something went wrong, please try again. If this continuies please contact the I.T Department";
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
      }
    }));


    await(this.dbService.GetSpecificClients(ID).subscribe((ret:any) => {
      if(ret != "false"){
      
        let a = (ret as string).split(',');

        this.ClientName = a[0];
        this.OldClientName = a[0];
        this.Province = a[1];
        this.ProvinceChanged();
        this.Area = a[2];

      }else{
        this.PopupTitle = "Something went wrong"
        this.DisplayErrormessage = "Something went wrong, please try again. If this continuies please contact the I.T Department";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
    }));
  }

  async ProvinceChanged(){
    this.Area="";
    await(this.dbService.getAreaPerProvince(this.Province).subscribe((ret:any) => {
      this.Areas.splice(0);
      if(ret != "false"){
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          this.Areas.push(element);
        });
      }else{
        //alert("Please check your connection and try again");
      }
    }));
  }
  

  Reset(){
    this.ClientName =""; 
    this.Province="";
    this.Area="";
    this.Areas.splice(0);
  }

  Back(){
    this.router.navigate(['ViewClient']); 
  }


 
  async Delete(){
    await(this.dbService.DeleteClient(this.ClientName).subscribe((ret:any) => {
      if(!(String(ret).includes("Error"))){
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "The Client has been deleted";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
        this.Back();
      }else{
        if(String(ret).includes("Duplicate entry")){
          this.PopupTitle = "Invalid Details"
          this.DisplayErrormessage = "This Client already exists";
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

  async Save(){
    await(this.dbService.EditClient(this.OldClientName, this.ClientName, this.Province, this.Area).subscribe((ret:any) => {
      if(!(String(ret).includes("Error"))){
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "The Client has been editted";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
        this.Back();
      }else{
        if(String(ret).includes("Duplicate entry")){
          this.PopupTitle = "Invalid Details"
          this.DisplayErrormessage = "This Client already exists";
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

  
  closeResult = '';
  DisplayErrormessage = "";
  PopupTitle = "";
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
