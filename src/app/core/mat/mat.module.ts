import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatSelectModule,
  MatButtonToggleModule
} from '@angular/material';

const MAT_MODULES = [
  MatSnackBarModule,
  MatExpansionModule,
  MatListModule,
  MatSidenavModule,
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatSelectModule,
  MatButtonToggleModule
];

@NgModule({
  imports: MAT_MODULES,
  exports: MAT_MODULES
})
export class MatModule {}
