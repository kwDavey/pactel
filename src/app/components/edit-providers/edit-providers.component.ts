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
