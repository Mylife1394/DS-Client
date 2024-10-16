import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { CustomlocalstorageService } from '../services/customlocalstorage.service';
//import { Group, GroupsService } from '../services/groups.service';
import { error } from 'console';
import { throwError } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { GroupService } from '../services/group.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = ConfigService.baseApiUrl + '/api/login';

  constructor(private http: HttpClient, private storageService: CustomlocalstorageService, private groupsService: GroupService) { }

  login(data: any) {
    return this.http.post(this.apiUrl + "?username=" + data.username + "&password=" + data.password, null)
      .pipe(tap((result: any) => {
        //if (result.isActive) {
          this.storageService.setItem('authUser', JSON.stringify(result));
          this.groupsService.getGroupById(result.group_id).subscribe({
            next: data => {
              this.storageService.setItem("authGroup", JSON.stringify(data));
            },
            error: error => { }
          });
        // }
        // else
        // {
        //   throw new Error('User is not Active!');
        // }
      }));
  }

  logout() {
    this.storageService.removeItem('authUser');
  }

  isLoggedIn() {
    let result = JSON.parse(this.storageService.getItem('authUser')!);
    return result !== null;//
  }
}
