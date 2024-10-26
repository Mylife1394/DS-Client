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
import { SensorsComponent } from "../../pages/sensors/sensors.component";
import { Sensor, SensorService } from 'src/app/services/sensor.service';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { TargetGeneratorService, TargetState } from 'src/app/services/target-generator.service';
import { v4 as uuidv4 } from 'uuid';
import { SignalRService } from 'src/app/services/signal-r.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-add-sensor',
  standalone: true,
  imports: [CommonModule, SharedModule, SensorsComponent, TranslatePipe],
  templateUrl: './add-sensor.component.html',
  styleUrl: './add-sensor.component.scss'
})
export default class AddSensorComponent implements AfterViewInit, OnInit {
  public sensorTypes: SensorType[];
  public map!: L.Map;
  public markergroup: Map<string, L.FeatureGroup> = new Map;
  public targetSymbol: Map<uuidv4, L.circleMarker> = new Map;
  public intervalToBlip: Map<L.circle, any> = new Map;
  public targetsInSensor: Map<number, uuidv4[]> = new Map;
  public countOfSensor: Map<number, number> = new Map;
  // constructor
  constructor(private iconService: IconService, private sensorTypeService: SensorTypeService,
    private sensorService: SensorService, private targetGeneratorService: TargetGeneratorService) {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }
  ngOnInit(): void {
    this.initializeMap();
    SignalRService.startConnection().then(() => {
      SignalRService.getConnection().invoke('getConnectionId')
        .then((connectionId: string) => {
          console.log("ConnectionId : " + connectionId);
        });
      SignalRService.getConnection().on("sendTarget", (targetState: TargetState) => {
        console.log(targetState);
        let latlng = L.latLng(targetState.latitude, targetState.longitude);
        this.targetSymbol.get(targetState.targetId).setLatLng(latlng);
      });
      SignalRService.getConnection().on("targetInSensorRange", (targetState: TargetState, sensor: Sensor) => {
        let sensorLayers = this.markergroup.get("sensor-group").getLayers();
        sensorLayers.forEach(sensorLayer => {
          if (sensorLayer.type == "circle") {
            if (sensorLayer.id == sensor.id)
              if (!this.intervalToBlip.has(sensorLayer)) {
                // Use setInterval to create the blinking effect (500 ms interval)
                this.intervalToBlip.set(sensorLayer, setInterval((circle: L.circle, color: any, fillColor: any, fillOpacity: any) => { this.toggleBlip(circle, color, fillColor, fillOpacity) }, 500, sensorLayer, sensor.sensorType.color, sensor.sensorType.color, 0.2));  // Blip every 500 milliseconds
                if (!this.targetsInSensor.has(sensor.id))
                  this.targetsInSensor.set(sensor.id, []);
                this.targetsInSensor.get(sensor.id).push(targetState.targetId);
              }
          }
        });

      });
      SignalRService.getConnection().on("targetOutOfSensorRange", (targetState: TargetState, sensor: Sensor) => {
        let sensorLayers = this.markergroup.get("sensor-group").getLayers();
        sensorLayers.forEach(sensorLayer => {
          if (sensorLayer.type == "circle") {
            if (sensorLayer.id == sensor.id)
              if (this.intervalToBlip.has(sensorLayer)) {
                let foundTargetId = this.targetsInSensor.get(sensor.id).findIndex(u => u == targetState.targetId)
                if (foundTargetId >= 0) {
                  // Use setInterval to create the blinking effect (500 ms interval)
                  clearInterval(this.intervalToBlip.get(sensorLayer));
                  this.intervalToBlip.delete(sensorLayer);
                  sensorLayer.setStyle({
                    fillOpacity: 0.2,
                    color: sensor.sensorType.color,
                    fillColor: sensor.sensorType.color
                  });
                  this.targetsInSensor.get(sensor.id).splice(foundTargetId, 1);
                }
              }
          }
        });
      });
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
      this.loadSensors();
    });

    this.centerMap();
    this.createLineTools();
    this.createPlayTools();
  }

// 'file:///C:\\Users\\faradid\\Desktop\\geoproject\\offline_tiles_iran_last\\{z}\\{z}_{x}_{y}.png'//
// 'http://localhost/map2/{z}/{x}/{y}.png'//
//'http://localhost/map/{z}/{z}_{x}_{y}.png'//
private initializeMap() {
  const baseMapURl = 'http://localhost/map/{z}/{z}_{x}_{y}.png'//'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  this.map = L.map('add-sensor-map', {
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
        let latlng = L.latLng(sargetStates[0].latitude, sargetStates[0].longitude);
        self.targetSymbol.set(targetId, L.circleMarker(latlng, { radius: 5, fillOpacity: 1.0 }));
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
      initialize: function (map, options) {
        L.Toolbar2.Action.prototype.initialize.call(this, map, options);
        this.isToggled = false;  // Track the toggle state (false = off, true = on)
      },
      onAdd: function (map) {
        L.Toolbar2.Action.prototype.onAdd.call(this, map);
        L.DomEvent.on(this._icon, 'click', this._preventDefault, this);
      },
      addHooks: function () {
        this.isToggled = !this.isToggled;
        if (this.isToggled) {
          // Change the icon to 'pause' (or any other icon for the toggled state)
          this.updateIcon('⏹️', 'Stop');
          self.targetGeneratorService.start().subscribe();
        } else {
          // Change the icon back to 'play'
          this.updateIcon('▶️', 'Play');
          self.targetGeneratorService.stop().subscribe();
        }

      },
      updateIcon: function (newHtml, newTooltip) {
        this.options.toolbarIcon.html = newHtml;  // Update icon HTML
        this.options.toolbarIcon.tooltip = newTooltip;  // Update tooltip text
        //this.prototy
        //this._button.title = newTooltip;  // Update the tooltip
      },
      _preventDefault: function (e) {
        L.DomEvent.preventDefault(e);
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
    let circle = L.circle([sensor.latitude, sensor.longitude], { radius: foundSensorType.range, fillColor: foundSensorType.color, fill: true, color: foundSensorType.color, weight: 1 });

    let marker = L.marker([sensor.latitude, sensor.longitude], { icon: markerIcon });
    circle.id = sensor.id;
    circle.type = "circle"
    marker.id = sensor.id;
    marker.type = "marker";
    this.markergroup.get("sensor-group").addLayer(marker);
    this.markergroup.get("sensor-group").addLayer(circle);
  }

  toggleBlip(circle: L.circle, color: any, fillColor: any, fillOpacity: any) {
    var currentOpacity = circle.options.fillOpacity;
    var newOpacity = (currentOpacity === 0.5) ? 0.2 : 0.5;

    // Update the circle style for the blip effect
    circle.setStyle({
      fillOpacity: newOpacity,
      color: newOpacity === 0.5 ? 'red' : color,  // Toggle color as well for more visual effect
      fillColor: newOpacity === 0.5 ? '#f03' : fillColor
    });

  }
}
