import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
// icons
import { IconService } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
//map
import * as L from 'leaflet';
import { SensorType, SensorTypeService } from 'src/app/services/sensor-type.service';
import { SensorsComponent } from "../sensors/sensors.component";
import { Sensor, SensorService } from 'src/app/services/sensor.service';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, SharedModule, SensorsComponent,TranslatePipe],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export default class MapComponent implements AfterViewInit ,OnInit{
  public sensorTypes: SensorType[];
  public map!: L.Map;
  public markergroup:Map<string,L.FeatureGroup> = new Map;
  // constructor
  constructor(private iconService: IconService, private sensorTypeService: SensorTypeService, private sensorService: SensorService) {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }
  ngOnInit(): void {
    this.initializeMap();
  }
  ngAfterViewInit(): void {
    this.sensorTypeService.get().subscribe((sensorTypes: SensorType[]) => {
      this.sensorTypes = sensorTypes;
    });
    this.loadSensors();
    this.centerMap();
  }

  private initializeMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    this.map = L.map('map', {
      center: [32.505, 54],
      zoom: 7
    });
    L.tileLayer(baseMapURl).addTo(this.map);
  }

  private centerMap() {
    // Create a LatLngBounds object to encompass all the marker locations
    //  const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));

    // Fit the map view to the bounds
    //this.map.fitBounds(bounds);
  }

  private loadSensors() {
    this.sensorService.get().subscribe((sensors: Sensor[]) => {
      sensors.forEach(sensor => {
        this.addMarkers(sensor);
      });
    })
  }

  private addMarkers(sensor: Sensor) {
    if(!this.markergroup.has(sensor.groupName))
    {
      let fg = L.featureGroup();
      fg.addTo(this.map);
      this.markergroup.set(sensor.groupName,fg);
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
    this.markergroup.get(sensor.groupName).addLayer(marker);
    this.markergroup.get(sensor.groupName).addLayer(circle);
  }
}
