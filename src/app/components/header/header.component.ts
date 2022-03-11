import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {SqlService} from '../../Database/sql.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public ActivePage = "";

  public UserLevel = "none";


  constructor(private dbService: SqlService,private router: Router) {}

  ngOnInit(): void {
    this.UserLevel = this.dbService.getUserLevel();

    this.ActivePage = String(localStorage.getItem('ActivePage'));
  }


  changePage(nextPage:string){
    this.ActivePage = nextPage;

    localStorage.setItem('ActivePage', nextPage);
    

    if(nextPage == "ClientView"){
      this.router.navigate(['ViewClient']); 
      this.ActivePage = "Client";
    }
    if(nextPage == "ClientAdd"){
      this.router.navigate(['AddClient']); 
      this.ActivePage = "Client";
    }

    if(nextPage == "AreasView"){
      this.router.navigate(['ViewArea']); 
      this.ActivePage = "Areas";
    }
    if(nextPage == "AreasAdd"){
      this.router.navigate(['AddArea']); 
      this.ActivePage = "Areas";
    }


    if(nextPage == "Provinces"){
      this.router.navigate(['ViewProvinces']); 
    }

    if(nextPage == "DistributorsView"){
      this.router.navigate(['ViewDistributors']); 
      this.ActivePage = "Distributors";
    }
    if(nextPage == "DistributorsAdd"){
      this.router.navigate(['AddDistributors']); 
      this.ActivePage = "Distributors";
    }

    if(nextPage == "ProvidersView"){
      this.router.navigate(['ViewProviders']); 
      this.ActivePage = "Providers";
    }
    if(nextPage == "ProvidersAdd"){
      this.router.navigate(['AddProviders']); 
      this.ActivePage = "Providers";
    }

    if(nextPage == "BranchesView"){
      this.router.navigate(['ViewBranches']); 
      this.ActivePage = "Branches";
    }
    if(nextPage == "BranchesAdd"){
      this.router.navigate(['AddBranches']); 
      this.ActivePage = "Branches";
    }

    if(nextPage == "UsersView"){
      this.router.navigate(['ViewUsers']); 
      this.ActivePage = "Users";
    }
    if(nextPage == "UsersAdd"){
      this.router.navigate(['AddUsers']); 
      this.ActivePage = "Users";
    }




    if(nextPage == "ImportBox"){
      this.router.navigate(['ScanBox']); 
      this.ActivePage = "Boxes";
    }
    if(nextPage == "PrepareBatches"){
      this.router.navigate(['PrepareBatches']); 
      this.ActivePage = "Boxes";
    }
    if(nextPage == "AllocateDistributor"){
      this.router.navigate(['AllocateDistributor']); 
      this.ActivePage = "Boxes";
    }
    if(nextPage == "TransferBranch"){
      this.router.navigate(['TransferBranch']); 
      this.ActivePage = "Boxes";
    }


  }

}
