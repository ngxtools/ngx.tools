import { NgModule } from '@angular/core';
import { environment } from '../../environments/environment';
import { AlgoliaModule } from './algolia/algolia.module';
import { MatModule } from './mat/mat.module';

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
