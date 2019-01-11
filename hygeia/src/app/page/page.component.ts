import { Component, OnInit } from '@angular/core';
import { SawtoothService } from '../sawtooth.service';


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  
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
 
   this.clickMessage="Blood type:"+btype+"Organ type:" +otype +" Gender: "+Gender + " Registration Date:"+date + " Name:" +Name ;
    const proc ="NHS"
    const action ="add"
    const FAMILYNAME = 'hygieia'
    const servDt =await this.Form.sendData(btype,otype,Gender,idproof,date,Name,proc,action,FAMILYNAME);
    
    this.servicedata="htis is service dAatta"+servDt;
    //+servDt.toString();
    
  }
  /*
  async getDnr(btype,otype){

    const recpDt=await this.Form.sendToRestAPIForList(btype,otype);
    console.log("Inside getRecp")
  }*/
}
