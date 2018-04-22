import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchRoutingModule } from './search-routing.module';
import { MatModule } from './../core/mat/mat.module';
import { SearchComponent } from './search/search.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { DeeplinkService } from './deeplink.service';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatModule, SearchRoutingModule],
  declarations: [SearchComponent, SearchResultComponent],
  providers: [DeeplinkService]
})
export class SearchModule {}
