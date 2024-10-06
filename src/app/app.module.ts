// angular import
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// project import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './theme/shared/shared.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LocalizationString, LocalizationStringService } from './services/localization-string.service';
export let localizationStrings: LocalizationString[] = [];
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule, BrowserAnimationsModule],
  bootstrap: [AppComponent],
  providers: [provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync()]
})

export class AppModule {
  constructor(private localizationStringService:LocalizationStringService){
    if (localizationStrings.length == 0) {
      this.localizationStringService.get().subscribe((data: LocalizationString[]) => {
        localizationStrings = data;
      });
    }
  }
}
