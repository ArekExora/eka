import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/Button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/Icon';
import { MatInputModule } from '@angular/material/Input';

const modules = [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
];

@NgModule({
  imports: [...modules],
  exports: [...modules]
})
export class MaterialModule { }
