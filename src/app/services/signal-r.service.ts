import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ConfigService } from './config.service';
import { HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private static connection: any = undefined;

  constructor() { }
  public static startConnection(): Promise<void> {
    if (!SignalRService.connection) {
      SignalRService.connection = new signalR.HubConnectionBuilder()
        .withUrl(ConfigService.baseApiUrl + "/serverHub", { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets })
        .withAutomaticReconnect()
        .build();
    }
    //return SignalRService.connection.start();
    if (this.connection.state === HubConnectionState.Connected) {
      // Connection is already established
      return Promise.resolve();
    }
    return SignalRService.connection
      .start()
      .then(() => {
        console.log('Connection started successfully');
      })
      .catch(err => {
        console.error('Error while starting connection: ', err);
      });
  }
  public static getConnection():any{
    return this.connection;
  }
}

