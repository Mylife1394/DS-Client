import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  static baseApiUrl = "http://localhost:5257";
  constructor() { }
}
