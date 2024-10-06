import { NgFor } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalizationString, LocalizationStringService } from 'src/app/services/localization-string.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { PaginatorLocalizeService } from 'src/app/services/paginator-localize.service';
import { CardComponent } from "../../theme/shared/components/card/card.component";
import { DeleteConfirmDlgComponent } from 'src/app/delete-confirm-dlg/delete-confirm-dlg.component';
import { MatDialog } from '@angular/material/dialog';
import { IconService } from '@ant-design/icons-angular';
import {
  EditOutline,
  DeleteOutline
} from '@ant-design/icons-angular/icons';
import { SharedModule } from 'src/app/theme/shared/shared.module';
@Component({
  selector: 'app-localization-string',
  standalone: true,
  imports: [SharedModule,ReactiveFormsModule, MatTableModule, MatPaginatorModule, NgFor, MatSortModule, CardComponent],
  templateUrl: './localization-string.component.html',
  styleUrl: './localization-string.component.scss'
})
export default class LocalizationStringComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'strKey', 'strValue', 'lang', 'action'];
  dataSource!: MatTableDataSource<LocalizationString>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  lsForm: FormGroup;
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private localizationStringService: LocalizationStringService, private paginatorLocalizeService: PaginatorLocalizeService, private iconService: IconService) {
    this.lsForm = formBuilder.group({
      strId: ['0'],
      strKey: ['', Validators.required],
      strValue: ['', Validators.required],
      lang: ['', Validators.required]
    });
    this.iconService.addIcon(
      ...[
        EditOutline,
        DeleteOutline
      ]);
  }

  ngAfterViewInit(): void {
    this.localizationStringService.get().subscribe((result: LocalizationString[]) => {
      //this.groups = result;
      this.dataSource = new MatTableDataSource<LocalizationString>(result);
      this.dataSource.sort = this.sort;
      this.paginatorLocalizeService.localize(this.paginator);
      this.dataSource.paginator = this.paginator;
    });
  }

  cancel() {
    this.lsForm.reset({ strId: 0 });
  }

  save() {
    let ls: LocalizationString = {
      strId: this.lsForm.controls["strId"].value,
      strKey: this.lsForm.controls["strKey"].value,
      strValue: this.lsForm.controls["strValue"].value,
      lang: this.lsForm.controls["lang"].value
    };

    if (this.lsForm.controls["strId"].value == '0') {
      this.localizationStringService.post(ls).subscribe((insertdata: LocalizationString) => {
        this.dataSource!.data.push(insertdata);
        this.dataSource!._updateChangeSubscription();
      });
    }
    else {
      this.localizationStringService.put(ls.strId, ls).subscribe(() => {
        let foundLS = this.dataSource!.data.find((x: { strId: any; }) => x.strId === ls.strId);
        Object.assign(foundLS, ls);
        this.dataSource!._updateChangeSubscription();
      });
    }
    this.lsForm.reset({ strId: 0 });
  }

  edit(ls: LocalizationString) {
    this.lsForm.setValue(ls);
  }

  deleteConfirm() {
    const dialogRef = this.dialog.open(DeleteConfirmDlgComponent);
    return dialogRef.afterClosed();
  }
  delete(id: number) {
    this.deleteConfirm().subscribe(result => {
      if (result)
        this.localizationStringService.delete(id).subscribe({
          next: data => {
            let foundLSIdx = this.dataSource!.data.findIndex((x: { strId: number; }) => x.strId === id);
            this.dataSource!.data.splice(foundLSIdx, 1);
            this.dataSource!._updateChangeSubscription();
          },
          error: error => {
            console.error('There was an error!', error);
          }
        });
    });
  }
}

