import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {
  ClientName = "";
  Province = "";
  Area = "";

  Provinces = [""];
  Areas = [""];

  PossibleClient = "";
  PossibleClientMain = [""];
  PossibleClients= [""];
  

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getData();
  }

  async getData(){
   
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


  async Save(){
    await(this.dbService.AddClient(this.ClientName, this.Province, this.Area).subscribe((ret:any) => {
      if(!(String(ret).includes("Error"))){
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "The Client has been Added";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
        this.Reset();
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

  Reset(){
    this.ClientName =""; 
    this.Province="";
    this.Area="";
    this.Areas.splice(0);
  }

  Back(){
    this.router.navigate(['ViewClient']); 
  }




  PossibleClientChanged(){
    this.ClientName = this.PossibleClient;
  }

  async AreaNameChanged(){


    this.PossibleClientMain.splice(0);
    this.PossibleClients.splice(0);
    

    if(this.Province != "" ){
      var formData = new FormData(); // Currently empty  Prepped
      formData.set("Province", this.Province + "' AND Area='" + this.Area);


      await(this.dbService.getClientsPerProvince(formData).subscribe((ret:any) => {
        if(!(String(ret).includes("Error"))){

          if(!(String(ret) == "false")){
            let a = (ret as string).split(';');
            a.forEach(element => {
              this.PossibleClientMain.push(element.split(',')[0]);

            });
  
            this.ClientNameChanged();
          }
        

        }else{
         
          this.PopupTitle = "Something went wrong"
          this.DisplayErrormessage = "Something went wrong, please try again. If this continuies please contact the I.T Department";
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
          
        }
      }));
    }
  }

  ClientNameChanged(){
    this.PossibleClients.splice(0);

    for (let index = 0; index < this.PossibleClientMain.length; index++) {
      if(this.PossibleClientMain[index].indexOf(this.ClientName) > -1){
        this.PossibleClients.push(this.PossibleClientMain[index]);
      }
      
    }
   
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
