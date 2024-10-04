import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SensorTypeService {
  private apiUrl = ConfigService.baseApiUrl + "/api/SensorType"
  constructor(private httpClient: HttpClient) { }

  get() {
    return this.httpClient.get(this.apiUrl);
  }

  post(sensorType: SensorType) {
    return this.httpClient.post(this.apiUrl, sensorType);
  }

  put(id: number, sensorType: SensorType) {
    return this.httpClient.put(this.apiUrl + "/" + id, sensorType);
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + "/" + id);
  }
}

export interface SensorType {
  id: number,
  name: string,
  range: number,
  iconBase64: string,
  color: string
}