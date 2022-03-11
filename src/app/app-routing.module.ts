import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';


import {ViewAreasComponent} from './components/view-areas/view-areas.component';
import {AddAreasComponent} from './components/add-areas/add-areas.component';
import {EditAreasComponent} from './components/edit-areas/edit-areas.component';

import { ViewProvincesComponent } from './components/view-provinces/view-provinces.component';


import { ViewDistrubutorsComponent }  from './components/view-distrubutors/view-distrubutors.component';
import { AddDistributorsComponent } from './components/add-distributors/add-distributors.component';
import { EditDistributorsComponent } from './components/edit-distributors/edit-distributors.component';

import { ViewProvidersComponent } from './components/view-providers/view-providers.component';
import { AddProvidersComponent } from './components/add-providers/add-providers.component';
import { EditProvidersComponent } from './components/edit-providers/edit-providers.component';

import { ViewBranchesComponent } from './components/view-branches/view-branches.component';
import { AddBranchesComponent } from './components/add-branches/add-branches.component';
import { EditBranchesComponent } from './components/edit-branches/edit-branches.component';

import { ViewUsersComponent } from './components/view-users/view-users.component';
import { AddUsersComponent } from './components/add-users/add-users.component';
import { EditUsersComponent } from './components/edit-users/edit-users.component';

import { ViewClientComponent } from './components/view-client/view-client.component';
import { AddClientComponent } from './components/add-client/add-client.component';
import { EditClientComponent } from './components/edit-client/edit-client.component';

import { ScanBoxComponent } from './components/scan-box/scan-box.component';
import { PrepareBatchesComponent } from './components/prepare-batches/prepare-batches.component';
import { AllocateDistrubutorComponent } from './components/allocate-distrubutor/allocate-distrubutor.component';
import { TransferBranchComponent } from './components/transfer-branch/transfer-branch.component';

import { AuthGaurdGuard } from './auth-gaurd.guard';

const routes: Routes = [ 

  { path : '', redirectTo: '/login', pathMatch: 'full'},


  { path : 'login', component: LoginComponent},

  { path : 'ViewArea', component: ViewAreasComponent, canActivate: [AuthGaurdGuard]},
  { path : 'AddArea', component: AddAreasComponent, canActivate: [AuthGaurdGuard]},
  { path : 'EditArea/:ID', component: EditAreasComponent, canActivate: [AuthGaurdGuard]},


  { path : 'ViewProvinces', component: ViewProvincesComponent, canActivate: [AuthGaurdGuard]},


  { path : 'ViewDistributors', component: ViewDistrubutorsComponent, canActivate: [AuthGaurdGuard]},
  { path : 'AddDistributors', component: AddDistributorsComponent, canActivate: [AuthGaurdGuard]},
  { path : 'EditDistributors/:ID', component: EditDistributorsComponent, canActivate: [AuthGaurdGuard]}, 

  { path : 'ViewProviders', component: ViewProvidersComponent, canActivate: [AuthGaurdGuard]},
  { path : 'AddProviders', component: AddProvidersComponent, canActivate: [AuthGaurdGuard]},
  { path : 'EditProviders/:ID', component: EditProvidersComponent, canActivate: [AuthGaurdGuard]},

  { path : 'ViewBranches', component: ViewBranchesComponent, canActivate: [AuthGaurdGuard]},
  { path : 'AddBranches', component: AddBranchesComponent, canActivate: [AuthGaurdGuard]},
  { path : 'EditBranches/:ID', component: EditBranchesComponent, canActivate: [AuthGaurdGuard]},
  
  { path : 'ViewUsers', component: ViewUsersComponent, canActivate: [AuthGaurdGuard]},
  { path : 'AddUsers', component: AddUsersComponent, canActivate: [AuthGaurdGuard]},
  { path : 'EditUsers/:ID', component: EditUsersComponent, canActivate: [AuthGaurdGuard]},

  { path : 'ViewClient', component: ViewClientComponent, canActivate: [AuthGaurdGuard]},
  { path : 'AddClient', component: AddClientComponent, canActivate: [AuthGaurdGuard]},
  { path : 'EditClient/:ID', component: EditClientComponent, canActivate: [AuthGaurdGuard]},

  { path : 'ScanBox', component: ScanBoxComponent},
  
  { path : 'PrepareBatches', component: PrepareBatchesComponent},
  { path : 'AllocateDistributor', component: AllocateDistrubutorComponent},
  { path : 'TransferBranch', component: TransferBranchComponent},
  
  
  

 

  { path : '**', redirectTo: '/login', pathMatch: 'full'},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
