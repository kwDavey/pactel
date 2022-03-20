import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

//FOR SQL
import { HttpClientModule } from '@angular/common/http';

//two way binding
import { FormsModule } from '@angular/forms';

//Used for table searches
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ViewAreasComponent } from './components/view-areas/view-areas.component';
import { AddAreasComponent } from './components/add-areas/add-areas.component';
import { EditAreasComponent } from './components/edit-areas/edit-areas.component';
import { ViewProvincesComponent } from './components/view-provinces/view-provinces.component';
import { ViewDistrubutorsComponent }  from './components/view-distrubutors/view-distrubutors.component';
import { ViewProvidersComponent } from './components/view-providers/view-providers.component';
import { ViewBranchesComponent } from './components/view-branches/view-branches.component';
import { ViewUsersComponent } from './components/view-users/view-users.component';
import { AddDistributorsComponent } from './components/add-distributors/add-distributors.component';
import { EditDistributorsComponent } from './components/edit-distributors/edit-distributors.component';
import { AddProvidersComponent } from './components/add-providers/add-providers.component';
import { EditProvidersComponent } from './components/edit-providers/edit-providers.component';
import { AddBranchesComponent } from './components/add-branches/add-branches.component';
import { EditBranchesComponent } from './components/edit-branches/edit-branches.component';
import { AddUsersComponent } from './components/add-users/add-users.component';
import { EditUsersComponent } from './components/edit-users/edit-users.component';
import { ScanBoxComponent } from './components/scan-box/scan-box.component';
import { ViewClientComponent } from './components/view-client/view-client.component';
import { AddClientComponent } from './components/add-client/add-client.component';
import { EditClientComponent } from './components/edit-client/edit-client.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrepareBatchesComponent } from './components/prepare-batches/prepare-batches.component';
import { AllocateDistrubutorComponent } from './components/allocate-distrubutor/allocate-distrubutor.component';
import { TransferBranchComponent } from './components/transfer-branch/transfer-branch.component';
import { AllocateClientComponent } from './components/allocate-client/allocate-client.component';
import { ViewboxesComponent } from './components/viewboxes/viewboxes.component';
import { ViewSpecificBoxComponent } from './components/view-specific-box/view-specific-box.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    ViewAreasComponent,
    AddAreasComponent,
    EditAreasComponent,
    ViewProvincesComponent,
    ViewDistrubutorsComponent,
    ViewProvidersComponent,
    ViewBranchesComponent,
    ViewUsersComponent,
    AddDistributorsComponent,
    EditDistributorsComponent,
    AddProvidersComponent,
    EditProvidersComponent,
    AddBranchesComponent,
    EditBranchesComponent,
    AddUsersComponent,
    EditUsersComponent,
    ScanBoxComponent,
    ViewClientComponent,
    AddClientComponent,
    EditClientComponent,
    PrepareBatchesComponent,
    AllocateDistrubutorComponent,
    TransferBranchComponent,
    AllocateClientComponent,
    ViewboxesComponent,
    ViewSpecificBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    Ng2SearchPipeModule,
    NgbModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
