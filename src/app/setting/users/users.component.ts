import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CardComponent } from "../../theme/shared/components/card/card.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { User, UserService } from 'src/app/services/user.service';
import { NgFor } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { IconService } from '@ant-design/icons-angular';
import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline,
  DeleteOutline
} from '@ant-design/icons-angular/icons';
import { DeleteConfirmDlgComponent } from 'src/app/delete-confirm-dlg/delete-confirm-dlg.component';
import { Group, GroupService } from 'src/app/services/group.service';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SharedModule, CardComponent,
    ReactiveFormsModule, MatTableModule, MatPaginatorModule, NgFor, MatSortModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export default class UsersComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'username', 'group', 'action'];
  dataSource!: MatTableDataSource<User>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public userForm: FormGroup;
  public groups: Group[] = [];
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private userService: UserService, private groupservice: GroupService, private iconService: IconService) {
    this.userForm = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      group_id: [0, Validators.required]
    });
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline,
        DeleteOutline
      ]
    );
  }

  ngAfterViewInit(): void {
    this.userService.get().subscribe((data: User[]) => {
      this.dataSource = new MatTableDataSource<User>(data);
      this.dataSource.sort = this.sort;
      // this.paginatorLocalizeServiceService.localize(this.paginator);
      this.dataSource.paginator = this.paginator;
    });
    this.groupservice.get().subscribe((data: Group[]) => {
      this.groups = data;
    });
  }

  cancel() {
    this.userForm.reset
  }
  save(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
    let foundGroup = this.groups.find((x: { id: any; }) => x.id === Number(form.value.group_id));
    let user: User = {
      id: form.value.id,
      name: form.value.name,
      username: form.value.username,
      password: form.value.password,
      group_id: Number(form.value.group_id),
      group: foundGroup
    }
    if (form.value.id > 0) {
      this.userService.put(form.value.id, user).subscribe(() => {
        let foundUser = this.dataSource!.data.find((x: { id: any; }) => x.id === user.id);
        
        foundUser!.name = user.name;
        foundUser!.username = user.username;
        foundUser!.password = user.password;
        foundUser!.group_id = user.group_id;
        foundUser!.group = user.group;
        this.dataSource!._updateChangeSubscription();
      });
    }
    else {
      this.userService.post(user).subscribe((insertdata: User) => {
        this.dataSource!.data.push(insertdata);
        this.dataSource!._updateChangeSubscription();
      });
    }
  }

  deleteConfirm() {
    const dialogRef = this.dialog.open(DeleteConfirmDlgComponent);
    return dialogRef.afterClosed();
  }

  deleteGroup(id: number) {
    this.deleteConfirm().subscribe(result => {
      if (result)
        this.userService.delete(id).subscribe({
          next: data => {
            let foundUserIdx = this.dataSource!.data.findIndex((x: { id: number; }) => x.id === id);
            this.dataSource!.data.splice(foundUserIdx, 1);
            this.dataSource!._updateChangeSubscription();
          },
          error: error => {
            //this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
        });
    });
  }

  editGroup(user: User) {
    this.userForm.controls["id"].setValue(user.id);
    this.userForm.controls["name"].setValue(user.name);
    this.userForm.controls["username"].setValue(user.username);
    this.userForm.controls["password"].setValue(user.password);
    this.userForm.controls["group_id"].setValue(user.group_id);
  }


}
