import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/Button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/Icon';
import { MatInputModule } from '@angular/material/Input';


@NgModule({
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
  ]
})
export class MaterialModule { }
