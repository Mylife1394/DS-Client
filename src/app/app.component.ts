// angular import
import { Component, OnInit } from '@angular/core';
import { SignalRService } from './services/signal-r.service';
import { LocalizationString, LocalizationStringService } from './services/localization-string.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  constructor(){}
  // public props
  title = 'mantis-free-version';
}
