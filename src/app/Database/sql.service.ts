import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SqlService {

  UserLoggedIn = false;
  UserLevel = "" ;

  Link = "https://www.silversharksswimmingacademy.co.za/Pactel/";
  

  constructor(private http:HttpClient,private router: Router) { }




  isUserLoggedIn(): boolean {
    if(localStorage.getItem('UserLoggedIn') == "true"){
      this.UserLoggedIn = true;
    }else{
      this.UserLoggedIn = false;
    }
    
    return this.UserLoggedIn;
  }

  getUserLevel(): string{

    if(localStorage.getItem('UserLevel') == "1£Admin"){
      this.UserLevel = "Admin";
    }else if(localStorage.getItem('UserLevel') == "1£Manager"){
      this.UserLevel = "Manager";
    }else{
      this.UserLevel = "User";
    }
    
    
    return this.UserLevel;
  }

  LogUserIn(Username:string,Password:string){
    return this.http.get(this.Link + 'login.php?username=' + Username + "&password=" + Password).pipe(catchError(this.handleError));
  }
  
  DidUserLogInSuccessfully(Rights:string, Success:Boolean){
    if(Success == true){

      localStorage.setItem('UserLoggedIn', "true");
      localStorage.setItem('UserLevel', "1£"+Rights);
      //localStorage.setItem('UserLevel', "1£Manager");
      //localStorage.setItem('UserLevel', "1£User");
      
      this.UserLoggedIn = true;
      this.UserLevel = Rights;
      console.log("LOGGED IN");

    }else{
      localStorage.setItem('UserLoggedIn', "false");
      localStorage.setItem('UserLevel', "");
      //localStorage.setItem('UserLevel', "1£Manager");
      //localStorage.setItem('UserLevel', "1£User");
      
      this.UserLoggedIn = false;
      this.UserLevel = "";
    }

  }


  Logout(){
    this.UserLoggedIn = false;
    this.UserLevel = "";
    localStorage.setItem('UserLoggedIn', "false");
    localStorage.setItem('UserLevel', "");

    this.router.navigate(['']); 
  }


  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //window.alert(errorMessage);
    window.alert("Something went wrong, please try again. If this continuies please contact the I.T Department");
    return throwError("Something went wrong, please try again. If this continuies please contact the I.T Department");
    //return throwError(errorMessage);
    
  }




  getAllProvinces(){
    return this.http.get(this.Link + 'getProvinces.php').pipe(catchError(this.handleError));
  }

  getAreaPerProvince(Province:string){
    return this.http.get(this.Link + 'getAreaPerProvinces.php?Province=' + Province).pipe(catchError(this.handleError));
  }


  GetAllClients(){
    return this.http.get(this.Link + 'getAllClients.php').pipe(catchError(this.handleError));
  }

  AddClient(Name:string,Province:string,Area:string){
    return this.http.get(this.Link + 'addClient.php?Name=' + Name + '&Province=' + Province  + '&Area=' + Area).pipe(catchError(this.handleError));
  }

  DeleteClient(Name:string){
    return this.http.get(this.Link + 'deleteClient.php?Name=' + Name).pipe(catchError(this.handleError));
  }

  EditClient(OldName:string,Name:string,Province:string,Area:string){
    var formData = new FormData(); // Currently empty

    formData.set('OldClientName', OldName);
    formData.set('ClientName', Name);
    formData.set('Province', Province);
    formData.set('Area', Area);


    return this.http.post(this.Link + "editClient.php", formData)
  }
  
  

  GetSpecificClients(ClientName:string){
    var formData = new FormData(); // Currently empty

    formData.set('ClientName', ClientName);


    return this.http.post(this.Link + "getSpecificClient.php", formData)
  }



  AddArea(Area:string,Province:string){
    return this.http.get(this.Link + 'addArea.php?Area=' + Area + '&Province=' + Province).pipe(catchError(this.handleError));
  }

  getAllAreas(){
    return this.http.get(this.Link + 'getAllAreas.php').pipe(catchError(this.handleError));
  }

  GetSpecificArea(AreaName:string){
    var formData = new FormData(); // Currently empty
    formData.set('AreaName', AreaName);
    return this.http.post(this.Link + "getSpecificArea.php", formData)
  }

  DeleteArea(Name:string){
    var formData = new FormData(); // Currently empty
    
    formData.set('AreaName', Name);
    return this.http.post(this.Link + "deleteArea.php", formData)
  }

  EditArea(OldName:string,Name:string,Province:string){
    var formData = new FormData(); // Currently empty

    formData.set('OldAreaName', OldName);
    formData.set('AreaName', Name);
    formData.set('Province', Province);


    return this.http.post(this.Link + "editArea.php", formData)
  }



  AddDistrubutor(DistributorsName:string, Province:string,Active:string){
    return this.http.get(this.Link + 'addDistributor.php?DistributorsName=' + DistributorsName + '&Province=' + Province+ '&Active=' + Active).pipe(catchError(this.handleError));
  }

  getAllDistrubutor(){
    return this.http.get(this.Link + 'getAllDistributors.php').pipe(catchError(this.handleError));
  }

  DeleteDistrubutor(Name:string){
    var formData = new FormData(); // Currently empty
    
    formData.set('DistributorName', Name);
    return this.http.post(this.Link + "deleteDistrubutor.php", formData)
  }

  EditDistrubutor(OldName:string,Name:string,Province:string,Active:string){
    var formData = new FormData(); // Currently empty

    formData.set('OldDistributorName', OldName);
    formData.set('DistributorName', Name);
    formData.set('Province', Province);
    formData.set('Active', Active);


    return this.http.post(this.Link + "editDistrubutor.php", formData)
  }


  GetSpecificDistrubutor(Name:string){
    var formData = new FormData(); // Currently empty
    formData.set('DistributorName', Name);
    return this.http.post(this.Link + "getSpecificDistrubutor.php", formData)
  }
  


  getAllProviders(){
    return this.http.get(this.Link + 'getAllProviders.php').pipe(catchError(this.handleError));
  }

  GetSpecificProvider(Name:string){
    var formData = new FormData(); // Currently empty
    formData.set('ProvidersName', Name);
    return this.http.post(this.Link + "getSpecificProvider.php", formData)
  }

  AddProvider(Provider:string,BoxSize:string,BatchSize:string){
    return this.http.get(this.Link + 'addProvider.php?Provider='+ Provider + '&BoxSize=' + BoxSize+ '&BatchSize=' + BatchSize).pipe(catchError(this.handleError));
  }

  DeleteProvider(Name:string){
    var formData = new FormData(); // Currently empty
    
    formData.set('ProvidersName', Name);
    return this.http.post(this.Link + "deleteProvider.php", formData)
  }

  EditProvider(OldProvider:string,Provider:string,BoxSize:string,BatchSize:string){
    var formData = new FormData(); // Currently empty

    formData.set('OldProvider', OldProvider);
    formData.set('Provider', Provider);
    formData.set('BoxSize', BoxSize);
    formData.set('BatchSize', BatchSize);


    return this.http.post(this.Link + "editProvider.php", formData)
  }




  GetAllBranches(){
    return this.http.get(this.Link + 'getAllBranches.php').pipe(catchError(this.handleError));
  }


  AddBranch(Name:string){
    return this.http.get(this.Link + 'addBranch.php?Name='+ Name).pipe(catchError(this.handleError));
  }

  DeleteBranches(Name:string){
    var formData = new FormData(); // Currently empty
    
    formData.set('Name', Name);
    return this.http.post(this.Link + "deleteBranch.php", formData)
  }

  EditBranches(OldName:string,Name:string){
    var formData = new FormData(); // Currently empty

    formData.set('OldName', OldName);
    formData.set('Name', Name);


    return this.http.post(this.Link + "editBranch.php", formData)
  }





  getAllUsers(){
    return this.http.get(this.Link + 'getAllUsers.php').pipe(catchError(this.handleError));
  }

  GetSpecificUser(Name:string){
    var formData = new FormData(); // Currently empty
    formData.set('Username', Name);
    return this.http.post(this.Link + "getSpecificUser.php", formData)
  }

  AddUser(Username:string,Password:string,Rights:string){
    var formData = new FormData(); // Currently empty
    formData.set('Username', Username);
    formData.set('Password', Password);
    formData.set('Rights', Rights);
    return this.http.post(this.Link + "addUser.php", formData)
  }

  DeleteUser(Name:string){
    var formData = new FormData(); // Currently empty
    
    formData.set('Username', Name);
    return this.http.post(this.Link + "deleteUser.php", formData)
  }

  EditUser(OldUsername:string,Username:string,Password:string,Rights:string){
    var formData = new FormData(); // Currently empty

    formData.set('OldUsername', OldUsername);
    formData.set('Username', Username);
    formData.set('Password', Password);
    formData.set('Rights', Rights);


    return this.http.post(this.Link + "editUser.php", formData)
  }


  AddNewBox(formData:FormData){
    return this.http.post(this.Link + "addNewBox.php", formData);
  }





  TransferBranch(BoxNumber:string,Branch:string){ 
    var formData = new FormData(); // Currently empty

    formData.set('BoxNumber', BoxNumber);
    formData.set('Branch', Branch);


    return this.http.post(this.Link + "TransferBranch.php", formData)
  }


  GetBoxDetails(BoxNumber:string){  
    var formData = new FormData(); // Currently empty

    formData.set('BoxNumber', BoxNumber);


    return this.http.post(this.Link + "getBoxDetails.php", formData)
  }


  AddNewBatch(formData:FormData){
    return this.http.post(this.Link + "addNewBatch.php", formData)
  }

  FinanilizeAllBatches(formData:FormData){
    return this.http.post(this.Link + "finanilizeAllBatches.php", formData)
  }


  ClearBoxBatches(formData:FormData){
    return this.http.post(this.Link + "clearBoxBatches.php", formData)
  }

  AllocateDistributor(formData:FormData){
    return this.http.post(this.Link + "allocateDistributor.php", formData)
  }


  
  getClientsPerProvince(formData:FormData){
    return this.http.post(this.Link + "getClientsPerProvince.php", formData)
  }

  FinishBox(formData:FormData){
    return this.http.post(this.Link + "FinishBox.php", formData)
  }


  
  getAllBoxes(){
    return this.http.get(this.Link + 'getAllBoxes.php').pipe(catchError(this.handleError));
  }

  getAllBoxesNames(formData:FormData){
    return this.http.post(this.Link + "getAllBoxNames.php", formData)
  }
  
}
