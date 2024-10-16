import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SensorLogService {
  private apiUrl = ConfigService.baseApiUrl + "/api/sensorLog"
  constructor(private httpClient: HttpClient) { }

  get() {
    return this.httpClient.get(this.apiUrl);
  }
}
