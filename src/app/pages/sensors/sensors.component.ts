import { NgFor, NgStyle } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { Sensor, SensorService } from 'src/app/services/sensor.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
//map
import * as L from 'leaflet';
import { TranslatePipe } from "../../pipes/translate.pipe";

@Component({
  selector: 'app-sensors',
  standalone: true,
  imports: [SharedModule, CardComponent, ReactiveFormsModule, MatTableModule, MatPaginatorModule, NgFor, MatSortModule, NgStyle, OnlyNumberDirective, TranslatePipe],
  templateUrl: './sensors.component.html',
  styleUrl: './sensors.component.scss'
})
export class SensorsComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'latitude', 'longitude', 'groupName', 'sensorType', 'action'];
  dataSource!: MatTableDataSource<Sensor>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input("Map") map!: L.Map;
  @Input("MarkerGroup") markergroup: Map<string, L.FeatureGroup>;
  public sensorForm: FormGroup;
  public sensorTypes: SensorType[] = [];

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private sensorTypeService: SensorTypeService, private iconService: IconService, private sensorService: SensorService) {
    this.sensorForm = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      showForUser: [true, Validators.required],
      sensorType_id: [0, Validators.required],
      selectbyMouse: [false]
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
    this.sensorService.get().subscribe((data: Sensor[]) => {
      this.dataSource = new MatTableDataSource<Sensor>(data);
      this.dataSource.sort = this.sort;
      // this.paginatorLocalizeServiceService.localize(this.paginator);
      this.dataSource.paginator = this.paginator;
    });
    this.sensorTypeService.get().subscribe((data: SensorType[]) => {
      this.sensorTypes = data;
    });
    let self = this;
    this.map.on('click', function (ev) {
      if(self.sensorForm.controls["selectbyMouse"].value == true)
      {
        self.sensorForm.controls["latitude"].setValue(ev.latlng.lat.toFixed(2));
        self.sensorForm.controls["longitude"].setValue(ev.latlng.lng.toFixed(2));
      }
    });
  }

  cancel() {
    this.sensorForm.reset({ id: 0 });
  }
  save(form: FormGroup) {

    let sensor: Sensor = {
      id: form.value.id,
      name: form.value.name,
      latitude: form.value.latitude,
      longitude: form.value.longitude,
      showForUser: form.value.showForUser,
      sensorType_id: Number(form.value.sensorType_id),
      sensorType: undefined
    }
    if (form.value.id > 0) {
      this.sensorService.put(form.value.id, sensor).subscribe(() => {
        let foundSensor = this.dataSource!.data.find((x: { id: any; }) => x.id === sensor.id);

        foundSensor!.name = sensor.name;
        foundSensor!.latitude = sensor.latitude;
        foundSensor!.longitude = sensor.longitude;
        foundSensor!.showForUser = sensor.showForUser;
        foundSensor!.sensorType_id = sensor.sensorType_id;
        this.dataSource!._updateChangeSubscription();
      });
    }
    else {
      this.sensorService.post(sensor).subscribe((insertdata: Sensor) => {
        this.dataSource!.data.push(insertdata);
        this.dataSource!._updateChangeSubscription();
        this.addMarkers(sensor);
      });
    }
    this.sensorForm.reset({ id: 0 });
  }

  private addMarkers(sensor: Sensor) {
    if (!this.markergroup.has("sensor-group")) {
      let fg = L.featureGroup();
      fg.addTo(this.map);
      this.markergroup.set("sensor-group", fg);
    }
    // Add your markers to the map
    let foundSensorType = this.sensorTypes.find((x: { id: any; }) => x.id === Number(sensor.sensorType_id));
    var markerIcon = L.icon({
      iconUrl: foundSensorType.iconBase64,
      iconSize: [30, 30]
      // iconAnchor: [22, 22],
      // popupAnchor: [-3, -76]
    });
    let circle = L.circle([sensor.latitude,sensor.longitude], { radius: foundSensorType.range, fillColor: foundSensorType.color, fill: true, color: foundSensorType.color, weight: 1 }).addTo(this.map);
    let marker = L.marker([sensor.latitude,sensor.longitude], { icon: markerIcon });
    circle.id = sensor.id;
    marker.id = sensor.id;
    this.markergroup.get("sensor-group").addLayer(marker);
    this.markergroup.get("sensor-group").addLayer(circle);
  }

  deleteConfirm() {
    const dialogRef = this.dialog.open(DeleteConfirmDlgComponent);
    return dialogRef.afterClosed();
  }

  deleteGroup(id: number) {
    this.deleteConfirm().subscribe(result => {
      if (result)
        this.sensorService.delete(id).subscribe({
          next: data => {
            let foundSensorIdx = this.dataSource!.data.findIndex((x: { id: number; }) => x.id === id);
            this.deleteMarker(this.dataSource!.data[foundSensorIdx]);
            this.dataSource!.data.splice(foundSensorIdx, 1);
            this.dataSource!._updateChangeSubscription();
          },
          error: error => {
            //this.errorMessage = error.message;
            console.error('There was an error!', error);
          }
        });
    });
  }

  editGroup(sensor: Sensor) {
    this.sensorForm.controls["id"].setValue(sensor.id);
    this.sensorForm.controls["name"].setValue(sensor.name);
    this.sensorForm.controls["latitude"].setValue(sensor.latitude);
    this.sensorForm.controls["longitude"].setValue(sensor.longitude);
    this.sensorForm.controls["showForUser"].setValue(sensor.showForUser);
    this.sensorForm.controls["sensorType_id"].setValue(sensor.sensorType_id);
  }

  private deleteMarker(sensor: Sensor) {
    if (this.markergroup.has("sensor-group")) {
      let layers = this.markergroup.get("sensor-group").getLayers();
      layers.forEach(layer => {
        if (layer.id == sensor.id) {
          this.markergroup.get("sensor-group").removeLayer(layer);
          layer.remove();
        }
      });
      layers = this.markergroup.get("sensor-group").getLayers();
      if (layers.lenght == 0) {
        this.markergroup.get("sensor-group").remove();
        this.markergroup.delete("sensor-group");
      }
    }
  }

}
