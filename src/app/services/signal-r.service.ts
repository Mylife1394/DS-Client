import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private static connection: any = undefined;

  constructor() { }
  public static getConnection(): any {
    if (!SignalRService.connection) {
      SignalRService.connection = new signalR.HubConnectionBuilder()
        .withUrl(ConfigService.baseApiUrl+"/serverHub",{skipNegotiation: true,transport: signalR.HttpTransportType.WebSockets})
        .withAutomaticReconnect()
        .build();
    }
    //return SignalRService.connection.start();
    return SignalRService.connection;
  }
}
