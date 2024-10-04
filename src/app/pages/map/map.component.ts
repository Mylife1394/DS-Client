import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
// icons
import { IconService } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
//map
import * as L from 'leaflet';
import { SensorType, SensorTypeService } from 'src/app/services/sensor-type.service';
import { SensorsComponent } from "../sensors/sensors.component";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, SharedModule, SensorsComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export default class MapComponent implements AfterViewInit {
  public sensorTypes:SensorType[];
  public map!: L.Map;
  markers: L.Marker[] = [
    L.marker([32.9539, 54.9106])
  ];
  // constructor
  constructor(private iconService: IconService,private sensorTypeService: SensorTypeService) {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }
  ngAfterViewInit(): void {
    this.sensorTypeService.get().subscribe((sensorTypes:SensorType[])=>{
      this.sensorTypes = sensorTypes;
    });
    this.initializeMap();
    this.addMarkers();
    this.centerMap();
  }

  private initializeMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    this.map = L.map('map',{
      center: [32.505, 54],
      zoom: 7});
    L.tileLayer(baseMapURl).addTo(this.map);
  }

  private addMarkers() {
    // Add your markers to the map
    this.markers.forEach(marker => marker.addTo(this.map));
  }

  private centerMap() {
    // Create a LatLngBounds object to encompass all the marker locations
  //  const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
    
    // Fit the map view to the bounds
    //this.map.fitBounds(bounds);
  }
}
