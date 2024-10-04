import { NgFor, NgStyle } from '@angular/common';
import { AfterViewInit, Component, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
import { OnlyNumberDirective } from 'src/app/directives/only-number.directive';
import { SensorType, SensorTypeService } from 'src/app/services/sensor-type.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sensor-type',
  standalone: true,
  imports: [SharedModule, CardComponent, ReactiveFormsModule, MatTableModule, MatPaginatorModule, NgFor, MatSortModule,NgStyle,OnlyNumberDirective],
  templateUrl: './sensor-type.component.html',
  styleUrl: './sensor-type.component.scss'
})
export default class SensorTypeComponent implements AfterViewInit{
  displayedColumns: string[] = ['name', 'range', 'icon', 'color', 'action'];
  dataSource!: MatTableDataSource<SensorType>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedFiles?: FileList;
  currentFile?: File;
  public sensorTypeForm: FormGroup;
  public preview = "";

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private sensorTypeService: SensorTypeService, private iconService: IconService) {
    this.sensorTypeForm = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      range: ['', Validators.required],
      iconFile: [''],
      color: [0, Validators.required]
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
    this.sensorTypeService.get().subscribe((data: SensorType[]) => {
      this.dataSource = new MatTableDataSource<SensorType>(data);
      this.dataSource.sort = this.sort;
      // this.paginatorLocalizeServiceService.localize(this.paginator);
      this.dataSource.paginator = this.paginator;
    });
  }

  cancel() {
    this.sensorTypeForm.reset({id:0});
  }
  save(form: FormGroup) {
    let sensorType: SensorType = {
      id: form.value.id,
      name: form.value.name,
      range: form.value.range,
      iconBase64: this.preview,
      color: form.value.color
    }
    if (form.value.id > 0) {
      this.sensorTypeService.put(form.value.id, sensorType).subscribe(() => {
        let foundSensorType = this.dataSource!.data.find((x: { id: any; }) => x.id === sensorType.id);
        
        foundSensorType!.name = sensorType.name;
        foundSensorType!.range = sensorType.range;
        foundSensorType!.iconBase64 = sensorType.iconBase64;
        foundSensorType!.color = sensorType.color;
        this.dataSource!._updateChangeSubscription();
      });
    }
    else {
      this.sensorTypeService.post(sensorType).subscribe((insertdata: SensorType) => {
        this.dataSource!.data.push(insertdata);
        this.dataSource!._updateChangeSubscription();
      });
    }
    this.sensorTypeForm.reset({id:0});
  }

  deleteConfirm() {
    const dialogRef = this.dialog.open(DeleteConfirmDlgComponent);
    return dialogRef.afterClosed();
  }

  deleteGroup(id: number) {
    this.deleteConfirm().subscribe(result => {
      if (result)
        this.sensorTypeService.delete(id).subscribe({
          next: data => {
            let foundSensorTypeIdx = this.dataSource!.data.findIndex((x: { id: number; }) => x.id === id);
            this.dataSource!.data.splice(foundSensorTypeIdx, 1);
            this.dataSource!._updateChangeSubscription();
          },
          error: error => {
            //this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
        });
    });
  }

  editGroup(sensorType: SensorType) {
    this.sensorTypeForm.controls["id"].setValue(sensorType.id);
    this.sensorTypeForm.controls["name"].setValue(sensorType.name);
    this.sensorTypeForm.controls["range"].setValue(sensorType.range);
    this.preview = sensorType.iconBase64;
    this.sensorTypeForm.controls["color"].setValue(sensorType.color);
  }

  selectFile(event: any): void {
    this.preview = '';
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

}
