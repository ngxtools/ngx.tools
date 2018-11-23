import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [{ path: '', component: SearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class SearchRoutingModule {}
