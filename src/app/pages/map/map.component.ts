import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
// icons
import { IconService } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
//map
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-toolbar';

import { SensorType, SensorTypeService } from 'src/app/services/sensor-type.service';
import { SensorsComponent } from "../sensors/sensors.component";
import { Sensor, SensorService } from 'src/app/services/sensor.service';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { TargetGeneratorService, TargetState } from 'src/app/services/target-generator.service';
import { v4 as uuidv4 } from 'uuid';
import { SignalRService } from 'src/app/services/signal-r.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, SharedModule, SensorsComponent, TranslatePipe],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export default class MapComponent implements AfterViewInit, OnInit {
  public sensorTypes: SensorType[];
  public map!: L.Map;
  public markergroup: Map<string, L.FeatureGroup> = new Map;
  public targetSymbol: Map<uuidv4, L.circleMarker> = new Map;
  public countOfSensor: Map<number, number> = new Map;
  // constructor
  constructor(private iconService: IconService, private sensorTypeService: SensorTypeService,
    private sensorService: SensorService, private targetGeneratorService: TargetGeneratorService) {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }
  ngOnInit(): void {
    this.initializeMap();
    SignalRService.getConnection().invoke('getConnectionId')
      .then((connectionId: string) => {
        console.log("ConnectionId : " + connectionId);
      });
    SignalRService.getConnection().on("sendTarget", (targetState: TargetState) => {
      console.log(targetState);
      let latlng = L.latLng(targetState.latitude,targetState.longitude);
      this.targetSymbol.get(targetState.targetId).setLatLng(latlng);
    })
  }
  ngAfterViewInit(): void {
    this.sensorTypeService.get().subscribe((sensorTypes: SensorType[]) => {
      this.sensorTypes = sensorTypes;
      sensorTypes.forEach(sensorType => {
        this.sensorTypeService.CountOfSensor(sensorType.id).subscribe((value: number) => {
          this.countOfSensor.set(sensorType.id, value);
        });
      });
    });
    this.loadSensors();
    this.centerMap();
    this.createLineTools();
    this.createPlayTools();
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

  private createLineTools() {
    var editableLayers = new L.FeatureGroup();
    this.map.addLayer(editableLayers);
    var options = {
      position: 'topright',
      draw: {
        polyline: {
          shapeOptions: {
            color: '#f357a1',
            weight: 2
          }
        },
        polygon: false,
        marker: false,
        rectangle: false,
        circle: false,
        circlemarker: false
      },
      edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: false
      }
    };

    var drawControl = new L.Control.Draw(options);
    this.map.addControl(drawControl);
    let self = this;
    this.map.on(L.Draw.Event.CREATED, function (e) {
      var type = e.layerType,
        layer = e.layer;

      // if (type === 'marker') {
      //     layer.bindPopup('A popup!');
      // }
      let sargetStates: TargetState[] = [];
      let result: any[] = layer.getLatLngs();
      let targetId = uuidv4();
      result.forEach(latlng => {
        let targetState: TargetState = {
          targetId: targetId,
          latitude: latlng.lat,
          longitude: latlng.lng,
          speed: 222.222//~= 800 km/h
        };
        sargetStates.push(targetState);
      });

      self.targetGeneratorService.saveTargetsTrajectory(sargetStates).subscribe(() => {
        editableLayers.addLayer(layer);
        layer.targetId = targetId;
        let latlng = L.latLng(sargetStates[0].latitude,sargetStates[0].longitude);
        self.targetSymbol.set(targetId,L.circleMarker(latlng,{radius:5,fillOpacity:1.0}));
        self.targetSymbol.get(targetId).addTo(self.map);
      });
    });
  }

  private createPlayTools() {
    let self = this;
    var MyCustomAction = L.Toolbar2.Action.extend({

      options: {
        toolbarIcon: {
          html: '▶️',
          tooltip: 'Start Simulation'
        }
      },

      addHooks: function () {
        self.targetGeneratorService.start().subscribe();
      }

    });

    new L.Toolbar2.Control({
      actions: [MyCustomAction]
    }).addTo(this.map);
  }

  private loadSensors() {
    this.sensorService.get().subscribe((sensors: Sensor[]) => {
      sensors.forEach(sensor => {
        this.addMarkers(sensor);
      });
    })
  }

  private addMarkers(sensor: Sensor) {
    if (!this.markergroup.has(sensor.groupName)) {
      let fg = L.featureGroup();
      fg.addTo(this.map);
      this.markergroup.set(sensor.groupName, fg);
    }
    // Add your markers to the map
    let foundSensorType = this.sensorTypes.find((x: { id: any; }) => x.id === Number(sensor.sensorType_id));
    var markerIcon = L.icon({
      iconUrl: foundSensorType.iconBase64,
      iconSize: [30, 30]
      // iconAnchor: [22, 22],
      // popupAnchor: [-3, -76]
    });
    let circle = L.circle([sensor.latitude, sensor.longitude], { radius: foundSensorType.range, fillColor: foundSensorType.color, fill: true, color: foundSensorType.color, weight: 1 }).addTo(this.map);
    let marker = L.marker([sensor.latitude, sensor.longitude], { icon: markerIcon });
    circle.id = sensor.id;
    marker.id = sensor.id;
    this.markergroup.get(sensor.groupName).addLayer(marker);
    this.markergroup.get(sensor.groupName).addLayer(circle);
  }
}
