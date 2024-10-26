import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { SensorType } from './sensor-type.service';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private apiUrl = ConfigService.baseApiUrl + "/api/Sensor"
  constructor(private httpClient: HttpClient) { }
  
  get() {
    return this.httpClient.get(this.apiUrl);
  }

  post(sensor: Sensor) {
    return this.httpClient.post(this.apiUrl, sensor);
  }

  put(id: number, sensor: Sensor) {
    return this.httpClient.put(this.apiUrl + "/" + id, sensor);
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + "/" + id);
  }
}

export interface Sensor {
  id: number,
  name: string,
  latitude: number,
  longitude: number,
  showForUser: boolean,
  sensorType_id:number
  sensorType:SensorType | undefined
}
