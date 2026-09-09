import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // ... other imports
    HttpClientModule,
    FormsModule
  ],
})
export class AppModule { }