import { Component, OnInit } from '@angular/core';
import { SawtoothService } from '../sawtooth.service';

@Component({
  selector: 'app-resp',
  templateUrl: './resp.component.html',
  styleUrls: ['./resp.component.css']
})
export class RespComponent implements OnInit {

  users=[];
  clickMessage="";
  servicedata="";

  constructor(private Form:SawtoothService) { 
    console.log("Inside page component.ts")
  }
  ngOnInit() {
  }
  async addForm(btype:string,otype:string,Gender:string,idproof:string,date:string,Name:string){
   // event.preventDefault();
   
   this.clickMessage="Blood type:"+btype+"Organ type:" +otype +" Gender: "+Gender + " Registration Date:"+date + " Name:" +Name;
   const reproc ="resp"
   const action ="add"
   const FAMILYNAME = 'hygieia'
   const servDt =await this.Form.sendData(btype,otype,Gender,idproof,date,Name,reproc,action,FAMILYNAME);
    
    this.servicedata="htis is service dAatta"+servDt;
    //+servDt.toString();
    
  }
}