import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './page/page.component';
import { RespComponent } from './resp/resp.component';
import { AboutComponent } from './about/about.component';
import { MainComponent } from './main/main.component';
import { NhsComponent } from './nhs/nhs.component';
import { EventsbarComponent } from './eventsbar/eventsbar.component';
import { HospitalValidatorComponent } from './hospital-validator/hospital-validator.component';
const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'home', component: PageComponent},
  { path: 'resp', component: RespComponent},
  { path: 'about', component: AboutComponent},
  {path:'nhs',component:NhsComponent},
  { path: 'events', component: EventsbarComponent},
  {path:'hv',component:HospitalValidatorComponent}
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }