import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CardComponent } from "../../theme/shared/components/card/card.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Group, GroupService } from 'src/app/services/group.service';
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
import { TranslatePipe } from "../../pipes/translate.pipe";
import { PaginatorLocalizeService } from 'src/app/services/paginator-localize.service';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [SharedModule, CardComponent,
    ReactiveFormsModule, MatTableModule, MatPaginatorModule, NgFor, MatSortModule, TranslatePipe],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export default class GroupsComponent implements AfterViewInit {

  displayedColumns: string[] = ['groupName', 'action'];
  dataSource!: MatTableDataSource<Group>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public groupForm: FormGroup;

  constructor(public dialog: MatDialog,private formBuilder: FormBuilder,private paginatorLocalizeServiceService : PaginatorLocalizeService, private groupService: GroupService, private iconService: IconService) {
    this.groupForm = this.formBuilder.group({
      id: ['0'],
      name: ['', Validators.required]
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
    this.groupService.get().subscribe((data: Group[]) => {
      this.dataSource = new MatTableDataSource<Group>(data);
      this.dataSource.sort = this.sort;
      this.paginatorLocalizeServiceService.localize(this.paginator);
      this.dataSource.paginator = this.paginator;
    });
  }

  cancel() {
    this.groupForm.reset
  }
  save(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
    let group: Group = {
      id: form.value.id,
      name: form.value.name
    }
    if (form.value.id > 0) {
      this.groupService.put(form.value.id,group).subscribe(() => {
        let foundGroup = this.dataSource!.data.find((x: { id: any; }) => x.id === form.value.id);
            foundGroup!.name = form.value.name;
            this.dataSource!._updateChangeSubscription();
      });
    }
    else {
      this.groupService.post(group).subscribe((insertdata: Group) => {
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
        this.groupService.delete(id).subscribe({
          next: data => {
            let foundGroupIdx = this.dataSource!.data.findIndex((x: { id: number; }) => x.id === id);
            this.dataSource!.data.splice(foundGroupIdx, 1);
            this.dataSource!._updateChangeSubscription();
          },
          error: error => {
            //this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
        });
    });
  }

  editGroup(group: Group) {
    this.groupForm.controls["id"].setValue(group.id);
    this.groupForm.controls["name"].setValue(group.name);
  }
}
