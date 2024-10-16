import { AfterViewInit, Component } from '@angular/core';
import { CardComponent } from "../../theme/shared/components/card/card.component";
import { TranslatePipe } from "../../pipes/translate.pipe";
import { SensorType, SensorTypeService } from 'src/app/services/sensor-type.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sensor-log',
  standalone: true,
  imports: [CardComponent, TranslatePipe,SharedModule],
  templateUrl: './sensor-log.component.html',
  styleUrl: './sensor-log.component.scss'
})
export default class SensorLogComponent implements AfterViewInit {
  public countOfSensor: Map<number, number> = new Map;
  sensorTypes: SensorType[];
  constructor(private sensorTypeService:SensorTypeService){}

  ngAfterViewInit(): void {
    this.sensorTypeService.get().subscribe((sensorTypes: SensorType[]) => {
      this.sensorTypes = sensorTypes;
      sensorTypes.forEach(sensorType => {
        this.sensorTypeService.CountOfSensor(sensorType.id).subscribe((value: number) => {
          this.countOfSensor.set(sensorType.id, value);
        });
      });
    });
  }
}
