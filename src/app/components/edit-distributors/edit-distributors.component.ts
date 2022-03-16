import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-distributors',
  templateUrl: './edit-distributors.component.html',
  styleUrls: ['./edit-distributors.component.css']
})
export class EditDistributorsComponent implements OnInit {

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  DistributorsName= "";
  OldDistributorsName = "";
  Province = "";
  Active = "";
  Provinces = [""];

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
        alert("Please check your connection and try again");
      }
    }));

    await(this.dbService.GetSpecificDistrubutor(ID).subscribe((ret:any) => {
      if(ret != "false"){
      
        let a = (ret as string).split(',');

        this.DistributorsName = a[0];
        this.OldDistributorsName = a[0];
        this.Province = a[1];
        this.Active = a[2];

      }else{
        alert("Please check your connection and try again");
      }
    }));
  }


  async Delete(){
    await(this.dbService.DeleteDistrubutor(this.DistributorsName).subscribe((ret:any) => {
      if(!(String(ret).includes("Error"))){
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "The Distributor has been deleted";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
        this.Back();
      }else{
        if(String(ret).includes("Duplicate entry")){
          this.PopupTitle = "Invalid Details"
          this.DisplayErrormessage = "This Distributor already exists";
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
    await(this.dbService.EditDistrubutor(this.OldDistributorsName, this.DistributorsName, this.Province, this.Active).subscribe((ret:any) => {
      if(!(String(ret).includes("Error"))){
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "The Distributor has been editted";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
        this.Back(); 
      }else{
        if(String(ret).includes("Duplicate entry")){
          this.PopupTitle = "Invalid Details"
          this.DisplayErrormessage = "This Distributor already exists";
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
    this.DistributorsName= "";
    this.Province = "";
    this.Active = "";
  }

  Back(){
    this.router.navigate(['ViewDistributors']); 
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
