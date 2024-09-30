import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Group } from './group.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = ConfigService.baseApiUrl + "/api/user"
  constructor(private httpClient: HttpClient) { }

  get() {
    return this.httpClient.get(this.apiUrl);
  }

  post(user: User) {
    return this.httpClient.post(this.apiUrl, user);
  }

  put(id: number, user: User) {
    return this.httpClient.put(this.apiUrl + "/" + id, user);
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + "/" + id);
  }
}

export interface User {
  id: number,
  name: string,
  username: string,
  password: string,
  group_id: number,
  group : Group
}
