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
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/login.php?username=' + Username + "&password=" + Password).pipe(catchError(this.handleError));
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
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/getProvinces.php').pipe(catchError(this.handleError));
  }

  getAreaPerProvince(Province:string){
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/getAreaPerProvinces.php?Province=' + Province).pipe(catchError(this.handleError));
  }


  GetAllClients(){
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/getAllClients.php').pipe(catchError(this.handleError));
  }

  AddClient(Name:string,Province:string,Area:string){
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/addClient.php?Name=' + Name + '&Province=' + Province  + '&Area=' + Area).pipe(catchError(this.handleError));
  }

  DeleteClient(Name:string){
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/deleteClient.php?Name=' + Name).pipe(catchError(this.handleError));
  }

  EditClient(OldName:string,Name:string,Province:string,Area:string){
    var formData = new FormData(); // Currently empty

    formData.set('OldClientName', OldName);
    formData.set('ClientName', Name);
    formData.set('Province', Province);
    formData.set('Area', Area);


    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/editClient.php", formData)
  }
  
  

  GetSpecificClients(ClientName:string){
    var formData = new FormData(); // Currently empty

    formData.set('ClientName', ClientName);


    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/getSpecificClient.php", formData)
  }



  AddArea(Area:string,Province:string){
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/addArea.php?Area=' + Area + '&Province=' + Province).pipe(catchError(this.handleError));
  }

  getAllAreas(){
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/getAllAreas.php').pipe(catchError(this.handleError));
  }

  GetSpecificArea(AreaName:string){
    var formData = new FormData(); // Currently empty
    formData.set('AreaName', AreaName);
    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/getSpecificArea.php", formData)
  }

  DeleteArea(Name:string){
    var formData = new FormData(); // Currently empty
    
    formData.set('AreaName', Name);
    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/deleteArea.php", formData)
  }

  EditArea(OldName:string,Name:string,Province:string){
    var formData = new FormData(); // Currently empty

    formData.set('OldAreaName', OldName);
    formData.set('AreaName', Name);
    formData.set('Province', Province);


    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/editArea.php", formData)
  }



  AddDistrubutor(DistributorsName:string, Province:string,Active:string){
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/addDistributor.php?DistributorsName=' + DistributorsName + '&Province=' + Province+ '&Active=' + Active).pipe(catchError(this.handleError));
  }

  getAllDistrubutor(){
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/getAllDistributors.php').pipe(catchError(this.handleError));
  }

  DeleteDistrubutor(Name:string){
    var formData = new FormData(); // Currently empty
    
    formData.set('DistributorName', Name);
    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/deleteDistrubutor.php", formData)
  }

  EditDistrubutor(OldName:string,Name:string,Province:string,Active:string){
    var formData = new FormData(); // Currently empty

    formData.set('OldDistributorName', OldName);
    formData.set('DistributorName', Name);
    formData.set('Province', Province);
    formData.set('Active', Active);


    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/editDistrubutor.php", formData)
  }


  GetSpecificDistrubutor(Name:string){
    var formData = new FormData(); // Currently empty
    formData.set('DistributorName', Name);
    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/getSpecificDistrubutor.php", formData)
  }
  


  getAllProviders(){
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/getAllProviders.php').pipe(catchError(this.handleError));
  }

  GetSpecificProvider(Name:string){
    var formData = new FormData(); // Currently empty
    formData.set('ProvidersName', Name);
    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/getSpecificProvider.php", formData)
  }

  AddProvider(Provider:string,BoxSize:string,BatchSize:string){
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/addProvider.php?Provider='+ Provider + '&BoxSize=' + BoxSize+ '&BatchSize=' + BatchSize).pipe(catchError(this.handleError));
  }

  DeleteProvider(Name:string){
    var formData = new FormData(); // Currently empty
    
    formData.set('ProvidersName', Name);
    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/deleteProvider.php", formData)
  }

  EditProvider(OldProvider:string,Provider:string,BoxSize:string,BatchSize:string){
    var formData = new FormData(); // Currently empty

    formData.set('OldProvider', OldProvider);
    formData.set('Provider', Provider);
    formData.set('BoxSize', BoxSize);
    formData.set('BatchSize', BatchSize);


    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/editProvider.php", formData)
  }




  GetAllBranches(){
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/getAllBranches.php').pipe(catchError(this.handleError));
  }


  AddBranch(Name:string){
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/addBranch.php?Name='+ Name).pipe(catchError(this.handleError));
  }

  DeleteBranches(Name:string){
    var formData = new FormData(); // Currently empty
    
    formData.set('Name', Name);
    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/deleteBranch.php", formData)
  }

  EditBranches(OldName:string,Name:string){
    var formData = new FormData(); // Currently empty

    formData.set('OldName', OldName);
    formData.set('Name', Name);


    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/editBranch.php", formData)
  }





  getAllUsers(){
    return this.http.get('https://www.silversharksswimmingacademy.co.za/Pactel/getAllUsers.php').pipe(catchError(this.handleError));
  }

  GetSpecificUser(Name:string){
    var formData = new FormData(); // Currently empty
    formData.set('Username', Name);
    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/getSpecificUser.php", formData)
  }

  AddUser(Username:string,Password:string,Rights:string){
    var formData = new FormData(); // Currently empty
    formData.set('Username', Username);
    formData.set('Password', Password);
    formData.set('Rights', Rights);
    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/addUser.php", formData)
  }

  DeleteUser(Name:string){
    var formData = new FormData(); // Currently empty
    
    formData.set('Username', Name);
    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/deleteUser.php", formData)
  }

  EditUser(OldUsername:string,Username:string,Password:string,Rights:string){
    var formData = new FormData(); // Currently empty

    formData.set('OldUsername', OldUsername);
    formData.set('Username', Username);
    formData.set('Password', Password);
    formData.set('Rights', Rights);


    return this.http.post("https://www.silversharksswimmingacademy.co.za/Pactel/editUser.php", formData)
  }
}
