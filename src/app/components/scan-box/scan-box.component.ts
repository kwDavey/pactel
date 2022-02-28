import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scan-box',
  templateUrl: './scan-box.component.html',
  styleUrls: ['./scan-box.component.css']
})
export class ScanBoxComponent implements OnInit {

  BoxCode = "";

  constructor() { }

  ngOnInit(): void {
  }


  ClearSearch(){
    this.BoxCode = "";
  }

  Next(){

  }

}
