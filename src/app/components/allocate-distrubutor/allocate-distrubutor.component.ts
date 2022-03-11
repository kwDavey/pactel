import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { getLocaleDateFormat } from '@angular/common';
@Component({
  selector: 'app-allocate-distrubutor',
  templateUrl: './allocate-distrubutor.component.html',
  styleUrls: ['./allocate-distrubutor.component.css']
})
export class AllocateDistrubutorComponent implements OnInit {

  closeResult = '';
  DisplayErrormessage = "";
  PopupTitle = "";

  BoxNumber = "";

  Distributor = "";
  Distributors = [""];

  Province = "";
  Provinces = [""];

  data = [
    {
      ID:"",
      Province: "",
      Active:""

    }];

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getAllData();
  }

  Reset(){
    this.Province = "";
    this.BoxNumber = "";
    this.Distributor = "";

    this.Distributors.splice(0);
  }

  ProvinceChanged(){
    this.Distributors.splice(0);
    this.data.forEach(element => {
      if(element.Province == this.Province){
        this.Distributors.push(element.ID);
      }
    });
  }

  async getAllData(){
    await(this.dbService.getAllDistrubutor().subscribe((ret:any) => {
      if(ret != "false"){
        this.Distributors.splice(0);
        this.Provinces.splice(0);
        this.data.splice(0);

        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        a.forEach(element=> {
          let elementtemp = element.split(",")

          if(elementtemp[2] == "1"){
            let temp = { ID:elementtemp[0],
              Province: elementtemp[1],
              Active:elementtemp[2]
            }

            this.data.push(temp);
            if(!(this.Provinces.includes(elementtemp[1]))){
              this.Provinces.push(elementtemp[1]);
            }
          
          }
         
                
          
        });
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }


  async Save(){
    //**********************************************************************************************
    //Validate that the box has been Prepped
    //**********************************************************************************************

    var formData = new FormData(); // Currently empty  Prepped
    formData.set("BoxNumber", this.BoxNumber);
    formData.set("Distributor", this.Distributor);

    await(this.dbService.AllocateDistributor(formData).subscribe((ret:any) => {
      if(ret != "false"){ 

        
     
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "A Distributor has been set.";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();

      }else{

       

        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your internet connection and try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();

      }



    }));
  }


  Revert(){
    //**********************************************************************************************
    //Go back to "In Prep" stage"
    //**********************************************************************************************
  }

  Print(){
    //**********************************************************************************************
    //Go back to "In Prep" stage"
    //**********************************************************************************************
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
