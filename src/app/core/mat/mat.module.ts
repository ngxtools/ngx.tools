import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatCardModule, MatButtonModule, MatIconModule } from '@angular/material';

const MAT_MODULES = [MatIconModule, MatToolbarModule, MatCardModule, MatButtonModule];

@NgModule({
  imports: MAT_MODULES,
  exports: MAT_MODULES
})
export class MatModule {}
