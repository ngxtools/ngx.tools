import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MatModule } from './../core/mat/mat.module';
import { InfiniteScrollDirective } from './infinite-scroll.directive';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search/search.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatModule, SearchRoutingModule, SharedModule],
  declarations: [SearchComponent, SearchResultComponent, InfiniteScrollDirective],
})
export class SearchModule { }
