import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router } from "@angular/router";
import {SqlService} from "../../Database/sql.service";
import * as XLSX from 'xlsx';


@Pipe({
  name: 'customfilter'
})
export class FilterPipe implements PipeTransform {
  public transform(items: Array<any>, filter: {[key: string]: any }): Array<any> {
      return items.filter(item => {
        /*let temp = {
          Boxno: String,
          Provider: String,
          ClientName: String,
          ClientProvince: String,
          Status: String,
        };*/

        var temp: {
                    [key: string]: any
                  };

        temp = {
                  "fake": ""
               };
        
        if(filter.Status == "All"){
          temp.Status = item.Status;
        }else{
          temp.Status = filter.Status;
        }

        if(filter.Distributor == "All"){
          temp.Distributor = item.Distributor;
        }else if(filter.Distributor == "Empty"){
          temp.Distributor = "";
        }else{
          temp.Distributor = filter.Distributor;
        }

        if(filter.Provider == "All"){
          temp.Provider = item.Provider;
        }else if(filter.Provider == "Empty"){
          temp.Provider = "";
        }else{
          temp.Provider = filter.Provider;
        }

        if(filter.ClientName == "All"){
          temp.ClientName = item.ClientName;
        }else if(filter.ClientName == "Empty"){
          temp.ClientName = "";
        }else{
          temp.ClientName = filter.ClientName;
        }

        if(filter.ClientProvince == "All"){
          temp.ClientProvince = item.ClientProvince;
        }else if(filter.ClientProvince == "Empty"){
          temp.ClientProvince = "";
        }else{
          temp.ClientProvince = filter.ClientProvince;
        }

        //Manual search
        if(filter.Boxno == ""){//Repeat for all options
          temp.Boxno = item.Boxno;
        }else{
          //Search now
          if((item.Boxno as string).toUpperCase().indexOf(filter.Boxno.toUpperCase()) == 0){
            temp.Boxno = item.Boxno;
          }else{
            temp.Boxno = "";
          }
        }

        /*DistributorStartDate: this.SearchValue.DistributorStartDate,
      DistributorEndDate: this.SearchValue.DistributorEndDate,

      RecievedStartDate: this.SearchValue.RecievedStartDate,
      RecievedEndDate: this.SearchValue.RecievedEndDate,*/

   

         

        if(filter.DistributorStartDate == "" || filter.DistributorEndDate == ""){//Repeat for all options
          temp.DistributorStartDate = item.DistributorStartDate;
          temp.DistributorEndDate = item.DistributorEndDate;
        }else{

          var d1 = filter.DistributorStartDate.split("-");//Y M D
          var d2 = filter.DistributorEndDate.split("-");
          var c = item.DateDistributed.split("-");

          var from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
          var to   = new Date(d2[0], parseInt(d2[1])-1, d2[2]);
          var check = new Date(c[0], parseInt(c[1])-1, c[2]);


          //Search now
          if(check >= from && check <= to){
           
            temp.DistributorStartDate = item.DistributorStartDate;
            temp.DistributorEndDate = item.DistributorEndDate;

          }else{
            temp.DistributorStartDate = "";
            temp.DistributorEndDate = "";
          }
        }



        if(filter.RecievedStartDate == "" || filter.RecievedEndDate == ""){//Repeat for all options
          temp.RecievedStartDate = item.RecievedStartDate;
          temp.RecievedEndDate = item.RecievedEndDate;
        }else{

          var d1 = filter.RecievedStartDate.split("-");//Y M D
          var d2 = filter.RecievedEndDate.split("-");
          var c = item.DateReceived.split("-");

          var from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
          var to   = new Date(d2[0], parseInt(d2[1])-1, d2[2]);
          var check = new Date(c[0], parseInt(c[1])-1, c[2]);


          //Search now
          if(check >= from && check <= to){
           
            temp.RecievedStartDate = item.RecievedStartDate;
            temp.RecievedEndDate = item.RecievedEndDate;

          }else{
            temp.RecievedStartDate = "";
            temp.RecievedEndDate = "";
          }
        }


          const notMatchingField = Object.keys(temp)
                                       .find(key => item[key] !== temp[key]);

        

          if(notMatchingField == undefined){
            return true;
          }
          return !notMatchingField; // true if matches all fields
      });
  }
}

@Component({
  selector: 'app-viewboxes',
  templateUrl: './viewboxes.component.html',
  styleUrls: ['./viewboxes.component.css']
})
export class ViewboxesComponent implements OnInit {

  SearchValue =  { 
    Boxno: "",
    Provider:"All",

    DateReceived:"",
    Status: "All",
    Branch:"All",
    Distributor:"All",
    Province:"All",

    SerialNumber:"All",
    DateDistributed:"",

    ClientName:"All",
    ClientProvince:"All",

    DistributorStartDate: "",
    DistributorEndDate: "",

    RecievedStartDate: "",
    RecievedEndDate: "",

    fake: ""
  };

  Providers = [""];
  ClientNames = [""];
  ClientProvinces = [""];
  Distributors = [""];

  
  data = [
    { Boxno:"",
      Provider:"",

      DateReceived:"",
      Status:"",
      Branch:"",
      Distributor:"",
      Province:"",

      SerialNumber:"",
      DateDistributed:"",

      ClientName:"",
      ClientProvince:"",
      fake : ""
    }];

  p: number = 1;
  ItemsPerPage = 20;

  constructor(private dbService: SqlService,private router: Router) { }

  ngOnInit(): void {
    this.getData();   

    
  }

  async getData(){
    await(this.dbService.getAllBoxes().subscribe((ret:any) => {
      if(ret != "false"){
        this.data.splice(0);

        this.Providers.splice(0);
        this.ClientNames.splice(0);
        this.ClientProvinces.splice(0);
        this.Distributors.splice(0);



        let a = (ret as string).split(';');
        a.splice(a.length-1,1);

        this.Providers =  ["All","Empty"];
        this.ClientNames =  ["All","Empty"];
        this.ClientProvinces =  ["All","Empty"];
        this.Distributors =  ["All","Empty"];

        a.forEach(element=> {
          let elementtemp = element.split(",")
          let temp = {
                        Boxno:elementtemp[0],
                        Provider:elementtemp[1],

                        DateReceived:elementtemp[2],
                        Status:elementtemp[3],
                        Branch:elementtemp[4],
                        Distributor:elementtemp[5],
                        Province:elementtemp[6],

                        SerialNumber:elementtemp[7],
                        DateDistributed:elementtemp[8],

                        ClientName:elementtemp[9],
                        ClientProvince:elementtemp[10],
                        fake:""
                      };


          if(temp.Provider != ""){
            if(!(this.Providers.includes(temp.Provider))){
              this.Providers.push(temp.Provider);
            }
          }

          if(temp.ClientName != ""){
            if(!(this.ClientNames.includes(temp.ClientName))){
              this.ClientNames.push(temp.ClientName);
            }
          }

          if(temp.ClientProvince != ""){
            if(!(this.ClientProvinces.includes(temp.ClientProvince))){
              this.ClientProvinces.push(temp.ClientProvince);
            }
          }
          
          if(temp.Distributor != ""){
            if(!(this.Distributors.includes(temp.Distributor))){
              this.Distributors.push(temp.Distributor);
            }
          }

          
         
        
          

          this.data.push(temp);
        });
        this.ClearSearch();
      }else{
        alert("Please check your connection and try again");
      }
    }));
  }


  ViewData(AreaID:string){
    this.router.navigate(['/ViewSpecificBox', AreaID]);
  }
  

  ClearSearch(){

    this.SearchValue = { 
      Boxno: "",
          DateReceived:"",
          DateDistributed:"",

          Provider:"All",
      
          
          Status:"All",
          Branch:"All",
          Distributor:"All",
          Province:"All",
      
          SerialNumber:"All",
          
      
          ClientName:"All",
          ClientProvince:"All",
          DistributorStartDate: "",
          DistributorEndDate: "",

          RecievedStartDate: "",
          RecievedEndDate: "",

          fake:"1"
    };
  }

  ClearBoxNoSearch(){
    this.SearchValue.Boxno = "";
    this.Search();
  }

  Search(){
    this.SearchValue = { 
      Boxno: this.SearchValue.Boxno,
      Provider:this.SearchValue.Provider,
  
      DateReceived:this.SearchValue.DateReceived,
      Status:this.SearchValue.Status,
      Branch:this.SearchValue.Branch,
      Distributor:this.SearchValue.Distributor,
      Province:this.SearchValue.Province,
  
      SerialNumber:this.SearchValue.SerialNumber,
      DateDistributed:this.SearchValue.DateDistributed,
  
      ClientName:this.SearchValue.ClientName,
      ClientProvince:this.SearchValue.ClientProvince,

      DistributorStartDate: this.SearchValue.DistributorStartDate,
      DistributorEndDate: this.SearchValue.DistributorEndDate,

      RecievedStartDate: this.SearchValue.RecievedStartDate,
      RecievedEndDate: this.SearchValue.RecievedEndDate,

      fake:"2"
    };
  }


  btnDownloadReportClickExcel(){
    /* generate worksheet */
    let targetTableElm = document.getElementById("tblDataExport");
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: "Report" });
    XLSX.writeFile(wb, `Report.xlsx`);
  }

  
}


