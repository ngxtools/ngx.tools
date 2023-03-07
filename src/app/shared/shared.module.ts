import { NotFoundComponent } from './not-found/not-found.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HumanDatePipe } from '../search/humain-date.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

const MAT_MODULES = [
  MatCardModule,
  MatIconModule,
  MatTooltipModule,
  MatChipsModule,
  MatButtonModule,
];

@NgModule({
  imports: [CommonModule, RouterModule, ...MAT_MODULES],
  declarations: [NotFoundComponent, CardComponent, HumanDatePipe],
  exports: [CardComponent]
})
export class SharedModule {}
