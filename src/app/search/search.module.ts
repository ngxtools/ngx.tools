import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRoutingModule } from './search-routing.module';
import { MatModule } from './../core/mat/mat.module';
import { SearchComponent } from './search/search.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatModule, SearchRoutingModule],
  declarations: [SearchComponent, SearchResultComponent]
})
export class SearchModule {}
