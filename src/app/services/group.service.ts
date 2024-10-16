import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = ConfigService.baseApiUrl + "/api/group"
  constructor(private httpClient: HttpClient) { }

  get() {
    return this.httpClient.get(this.apiUrl);
  }
  getGroupById(id){
    return this.httpClient.get(this.apiUrl+"/" + id);
  }

  post(group: Group) {
    return this.httpClient.post(this.apiUrl, group);
  }

  put(id: number, group: Group) {
    return this.httpClient.put(this.apiUrl + "/" + id, group);
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + "/" + id);
  }
}

export interface Group {
  id: number,
  name: string,
}
