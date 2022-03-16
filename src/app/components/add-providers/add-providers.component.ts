import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-providers',
  templateUrl: './add-providers.component.html',
  styleUrls: ['./add-providers.component.css']
})
export class AddProvidersComponent implements OnInit {

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  ProviderName= "";
  BoxSize = 10;
  BatchSize = 1;

  ngOnInit(): void {

  }


  async Save(){

    if(this.BoxSize > 300 || this.BatchSize > 150){
      this.PopupTitle = "Invalid Details"
      this.DisplayErrormessage = "Box size may not exceed 300";
      let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
      element.click();
    }else{
      await(this.dbService.AddProvider(this.ProviderName, String(this.BoxSize), String(this.BatchSize)).subscribe((ret:any) => {
        if(!(String(ret).includes("Error"))){
          this.PopupTitle = "Success"
          this.DisplayErrormessage = "The Provider has been added";
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
          this.Reset();
        }else{
          if(String(ret).includes("Duplicate entry")){
            this.PopupTitle = "Invalid Details"
            this.DisplayErrormessage = "This Provider already exists";
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
    this.ProviderName= "";
    this.BoxSize = 10;
    this.BatchSize = 1;
  }

  Back(){
    this.router.navigate(['ViewProviders']); 
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
