import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class LocalizationStringService {
  private apiUrl: string = ConfigService.baseApiUrl + "/api/LocalizationString";
  constructor(private httpClient: HttpClient) { }

  get() {
    return this.httpClient.get(this.apiUrl);
  }

  post(localizationString: LocalizationString) {
    return this.httpClient.post(this.apiUrl, localizationString);
  }

  put(id: number, localizationString: LocalizationString) {
    return this.httpClient.put(this.apiUrl + "/" + id, localizationString);
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + "/" + id);
  }
}

export interface LocalizationString {
  strId: number,
  strKey: string,
  strValue: string,
  lang: string
}
