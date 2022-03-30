import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-areas',
  templateUrl: './add-areas.component.html',
  styleUrls: ['./add-areas.component.css']
})
export class AddAreasComponent implements OnInit {

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  Area= "";
  Province = "";
  PossibleArea = "";

  Provinces = [""];
  PossibleAreas = [""];
  PossibleAreasMain = [""];

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      //this.GetGroupsData(params.get('ID'));
    });


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


  

  async Save(){
    await(this.dbService.AddArea(this.Area, this.Province,).subscribe((ret:any) => {
      if(!(String(ret).includes("Error"))){
        this.PopupTitle = "Success"
        this.DisplayErrormessage = "The Area has been added";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
        this.Area = "";
        this.ProvinceNameChanged();
      }else{
        if(String(ret).includes("Duplicate entry")){
          this.PopupTitle = "Invalid Details"
          this.DisplayErrormessage = "This Area already exists";
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
    this.Area = "";
    this.Province = "";
  }

  Back(){
    this.router.navigate(['ViewArea']); 
  }


  PossibleAreaChanged(){
    this.Area = this.PossibleArea;
  }

  async ProvinceNameChanged(){


    this.PossibleAreasMain.splice(0);
    this.PossibleAreas.splice(0);
    

    if(this.Province != "" ){
      await(this.dbService.getAreaPerProvince(this.Province).subscribe((ret:any) => {
        if(!(String(ret).includes("Error"))){

          if(!(String(ret) == "false")){
            let a = (ret as string).split(';');
            a.forEach(element => {
              this.PossibleAreasMain.push(element);
            });
  
            this.AreaNameChanged();
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

  AreaNameChanged(){
    this.PossibleAreas.splice(0);

    for (let index = 0; index < this.PossibleAreasMain.length; index++) {
      if(this.PossibleAreasMain[index].indexOf(this.Area) > -1){
        this.PossibleAreas.push(this.PossibleAreasMain[index]);
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
