import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { typeWithParameters } from '@angular/compiler/src/render3/util';


@Component({
  selector: 'app-allocate-client',
  templateUrl: './allocate-client.component.html',
  styleUrls: ['./allocate-client.component.css']
})
export class AllocateClientComponent implements OnInit {


  firstscreen = true;
  Secondscreen = false;
  confirmed = false;

  BoxNumber = "";
  Batchsize = 2;
  CurrentBatch = 1;
  Boxsize = 0;
  Province = "";

  Data = [{Client:"",Area:""}];
  Clients = [[""]];
  Areas = [""];

  InputClients = [""];
  InputAreas = [""];
  
  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
  }



  Reset(){
    this.firstscreen = true;
    this.Secondscreen = false;
    this.BoxNumber = "";
  }

  ResetClients(){
    this.InputClients.splice(0);
    this.InputAreas.splice(0);

    this.Clients= [[]];
  }


  async Next(){
    await(this.dbService.GetBoxDetails(this.BoxNumber).subscribe((ret:any) => {
      if(ret != "false"){ 
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        let firsttemp = a[0].split(",");
        this.Boxsize = Number.parseInt(firsttemp[0]);
        this.Batchsize = Number.parseInt(firsttemp[1]);
        //this.Status = firsttemp[2];
        //this.branch = firsttemp[3];
        this.Province = firsttemp[4];

        if(firsttemp[2] == "Allocated"){
          this.getClientsPerArea();
          this.firstscreen = false;
          this.Secondscreen = true;
        }else{
          this.PopupTitle = "Error"
          this.DisplayErrormessage = "Box has invalid status:'" + firsttemp[2] +"', when it should be 'Allocated'"; 
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
        }

  
      }else{
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Please check your box number try again";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
    }));
  }


  async getClientsPerArea(){
    var formData = new FormData(); // Currently empty  Prepped
    formData.set("Province", this.Province);

    await(this.dbService.getClientsPerProvince(formData).subscribe((ret:any) => {
      this.Data.splice(0);
      this.Clients.splice(0);
      this.Areas.splice(0);

      if(ret != "false"){ 
        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

       

        a.forEach(element => {
          let firsttemp = element.split(",");

          let temp = {Client:firsttemp[0],Area:firsttemp[1]};


          if(!(this.Data.includes(temp))){
            this.Data.push(temp);

            if(!(this.Areas.includes(temp.Area))){
              this.Areas.push(temp.Area);
            }
            
          }

        });

        //Client 
        //Area
       
        //this.Status = firsttemp[2];
        //this.branch = firsttemp[3];
        console.log("HI");
  
      }else{
        this.PopupTitle = "Error"
        this.DisplayErrormessage = "Something went wrong, please try again. If this continuies please contact the I.T Department";
        let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
        element.click();
      }
    }));
  }

  AreaChanged(pos:number){
    //InputAreas[pos]
    this.Clients[pos] = [];

    this.Data.forEach(element => {
      if(element.Area == this.InputAreas[pos]){
        this.Clients[pos].push(element.Client);
      }
    });

  }


  async Done(){
    if(this.confirmed==false){
      //save in DB
      var strSQL = "";

      for (let index = 0; index < this.Batchsize; index++) {
        strSQL += "UPDATE `BoxDetails` SET `Client`='" + this.InputClients[index] +"' WHERE `Boxno`='" + this.BoxNumber + "' AND `Batchno` = '"+ (index+1) + "';";
        
      }

      var formData = new FormData(); // Currently empty  Prepped
      formData.set("SQL", strSQL);
      //formData.set("SQL2", "UPDATE `Boxes` SET `Status`='Done' WHERE `Boxno`='" + this.BoxNumber + "';");

      await(this.dbService.FinishBox(formData).subscribe((ret:any) => {
        if(ret != "false"){ 
        
          this.PopupTitle = "Confirmation"
          this.DisplayErrormessage = "Please confirm the above details"; 
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
          this.confirmed=true;


        }else{
          this.PopupTitle = "Error"
          this.DisplayErrormessage = "Please check your box number try again";
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
        }
      }));
      
    }else{
      var formData = new FormData(); // Currently empty  Prepped
     formData.set("SQL", "UPDATE `Boxes` SET `Status`='Done' WHERE `Boxno`='" + this.BoxNumber + "';");

      await(this.dbService.FinishBox(formData).subscribe((ret:any) => {
        if(ret != "false"){ 
        
          this.PopupTitle = "Success"
          this.DisplayErrormessage = "The box has been closed"; 
          let element: HTMLButtonElement = document.getElementById('ErrorButton') as HTMLButtonElement;
          element.click();
          this.Reset();
        }else{
          this.PopupTitle = "Error"
          this.DisplayErrormessage = "Please check your box number try again";
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