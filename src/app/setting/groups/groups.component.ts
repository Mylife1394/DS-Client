import { Component, ViewChild } from '@angular/core';
import { CardComponent } from "../../theme/shared/components/card/card.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Group, GroupService } from 'src/app/services/group.service';
import { NgFor } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [SharedModule, CardComponent,
    ReactiveFormsModule, MatTableModule, MatPaginatorModule, NgFor, MatSortModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export default class GroupsComponent {

  displayedColumns: string[] = ['groupName', 'action'];
  dataSource!: MatTableDataSource<Group>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  public groupForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private groupService: GroupService) {
    this.groupForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }
  cancel() {
    this.groupForm.reset
  }
  save(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
    let group: Group = {
      id: 0,
      name: form.value.name
    }
    this.groupService.post(group).subscribe((insertdata: Group) => {
      this.dataSource!.data.push(insertdata);
      this.dataSource!._updateChangeSubscription();
    });
  }

  deleteGroup(group: Group) {

  }
  editGroup(id: number) {

  }
}
