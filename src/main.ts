import { enableProdMode, importProvidersFrom } from '@angular/core';
import 'hammerjs';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Routes, provideRouter, withHashLocation, withViewTransitions } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app/app.component';
import { AlgoliaModule } from './app/core/algolia/algolia.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export const ROUTES: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  {
    path: 'search',
    loadComponent: () =>
      import('./app/search/search-container/search-container.component').then(
        (m) => m.SearchContainerComponent
      ),
  },
  {
    path: 'pkg/:name',
    loadComponent: () =>
      import('./app/details/details.component').then((m) => m.DetailsComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./app/shared/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(MatSnackBarModule),

    importProvidersFrom(
      AlgoliaModule.forRoot({
        applicationId: environment.algolia.applicationId,
        searchApiKey: environment.algolia.searchApiKey,
        indexName: environment.algolia.indexName,
      })
    ),

    provideRouter(ROUTES, withHashLocation(), withViewTransitions({
      skipInitialTransition: true
    })),

    importProvidersFrom(
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      })
    ),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
