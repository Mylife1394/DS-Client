import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Sensor } from './sensor.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SensorLogService {
  private apiUrl = ConfigService.baseApiUrl + "/api/sensoreLog"
  constructor(private httpClient: HttpClient) { }

  get() {
    return this.httpClient.get(this.apiUrl);
  }
}
export enum SensorStatus{
  Enable = 0,
  Disable = 1,
  Detected = 2
}

export interface SensorLog{
  id:number,
  sensor_id:number
  sensor:	Sensor,
  logTime:	Date,
  sensorStatus:SensorStatus
}
