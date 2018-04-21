import { AlgoliaModule } from './algolia/algolia.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatModule } from './mat/mat.module';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    MatModule,
    AlgoliaModule.forRoot({
      applicationId: environment.algolia.applicationId,
      searchApiKey: environment.algolia.searchApiKey,
      indexName: environment.algolia.indexName
    })
  ],
  exports: [MatModule, AlgoliaModule]
})
export class CoreModule {}
