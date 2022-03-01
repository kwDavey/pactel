import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-edit-providers',
  templateUrl: './edit-providers.component.html',
  styleUrls: ['./edit-providers.component.css']
})
export class EditProvidersComponent implements OnInit {

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router) { }

  oldProviderName="";
  ProviderName= "";
  BoxSize = "";
  BatchSize = "";

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.getData(params.get('ID'));
    });

  }

  async getData(ID:any){
   


    await(this.dbService.GetSpecificProvider(ID).subscribe((ret:any) => {
      if(ret != "false"){
      
        let a = (ret as string).split(',');

        this.ProviderName = a[0];
        this.oldProviderName = a[0];
        this.BoxSize = a[1];
        this.BatchSize = a[2];

      }else{
        alert("Please check your connection and try again");
      }
    }));
  }


  async Delete(){
    await(this.dbService.DeleteProvider(this.ProviderName).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Provider has been deleted");
        this.Back();
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  async Save(){
    await(this.dbService.EditProvider(this.oldProviderName, this.ProviderName, this.BoxSize, this.BatchSize).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Provider has been editted");
        this.Back();
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }

  Reset(){
    this.ProviderName= "";
    this.BoxSize = "";
    this.BatchSize = "";
  }

  Back(){
    this.router.navigate(['ViewProviders']); 
  }

}
