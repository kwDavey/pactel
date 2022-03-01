import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";

@Component({
  selector: 'app-add-providers',
  templateUrl: './add-providers.component.html',
  styleUrls: ['./add-providers.component.css']
})
export class AddProvidersComponent implements OnInit {

  constructor(private dbService: SqlService,private route: ActivatedRoute,  private router: Router) { }

  ProviderName= "";
  BoxSize = "";
  BatchSize = "";

  ngOnInit(): void {

  }


  async Save(){
    await(this.dbService.AddProvider(this.ProviderName, this.BoxSize, this.BatchSize).subscribe((ret:any) => {
      if(ret != "false"){
        alert("Provider Added");
        this.Reset();
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
