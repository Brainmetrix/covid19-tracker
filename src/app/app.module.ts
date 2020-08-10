import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './home/home.component';
import { CoronaService } from '../services/corona.service';
import { HelpfulLinksComponent } from './helpful-links/helpful-links.component';
import { FaqComponent } from './faq/faq.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HelpfulLinksComponent,
    FaqComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [CoronaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
