import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/Button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/Icon';
import { MatInputModule } from '@angular/material/Input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/Table';
import { MatToolbarModule } from '@angular/material/Toolbar';


@NgModule({
  exports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
  ]
})
export class MaterialModule { }
