import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details.component';

export const routes: Routes = [
  { path: '', redirectTo: ':name', pathMatch: 'full' },
  { path: ':name', component: DetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class DetailsRoutingModule { }
