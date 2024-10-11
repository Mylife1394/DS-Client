import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from './config.service';
@Injectable({
  providedIn: 'root'
})
export class TargetGeneratorService {
  private apiUrl = ConfigService.baseApiUrl + "/api/TargetGenerator"
  constructor(private httpclient: HttpClient) { }

  saveTargetsTrajectory(targetStates:TargetState[]){
    return this.httpclient.post(this.apiUrl+"/SaveTargetsTrajectory",targetStates);
  }

  start(){
    return this.httpclient.get(this.apiUrl+"/start");
  }
}

export interface TargetState{
  targetId:uuidv4,
  latitude:number,
  longitude:number,
  speed:number
}
