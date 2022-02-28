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

    this.route.paramMap.subscribe(params => {
      //this.GetGroupsData(params.get('ID'));
    });

  }


  Delete(){

  }

  Save(){

  }

  Reset(){

  }

  Back(){
    this.router.navigate(['ViewProviders']); 
  }

}
