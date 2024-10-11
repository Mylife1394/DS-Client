// angular import
import { Component, OnInit } from '@angular/core';
import { SignalRService } from './services/signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    SignalRService.getConnection().start().then(() => {
      console.log("SignalR was Started!");
    });
  }
  // public props
  title = 'mantis-free-version';
}
