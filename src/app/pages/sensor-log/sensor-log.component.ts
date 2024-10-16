import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CardComponent } from "../../theme/shared/components/card/card.component";
import { TranslatePipe } from "../../pipes/translate.pipe";
import { SensorType, SensorTypeService } from 'src/app/services/sensor-type.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgFor } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SensorLog, SensorLogService } from 'src/app/services/sensor-log.service';
import { PaginatorLocalizeService } from 'src/app/services/paginator-localize.service';
import { PersianDatePipePipe } from "../../pipes/persian-date-pipe.pipe";
import { SignalRService } from 'src/app/services/signal-r.service';
import { TargetState } from 'src/app/services/target-generator.service';

@Component({
  selector: 'app-sensor-log',
  standalone: true,
  imports: [CardComponent, TranslatePipe, SharedModule, MatTableModule, MatPaginatorModule, NgFor, MatSortModule, PersianDatePipePipe],
  templateUrl: './sensor-log.component.html',
  styleUrl: './sensor-log.component.scss'
})
export default class SensorLogComponent implements AfterViewInit {
  displayedColumns: string[] = ['sensorName', 'icon', 'logTime', 'status'];
  dataSource!: MatTableDataSource<SensorLog>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  public countOfSensor: Map<number, number> = new Map;
  sensorTypes: SensorType[];
  constructor(private sensorTypeService: SensorTypeService, private sensorLogServic: SensorLogService, private paginatorLocalizeService: PaginatorLocalizeService) { }

  ngOnInit(): void {
    SignalRService.startConnection().then(() => {
      SignalRService.getConnection().on("targetInSensorRange", (targetState: TargetState) => {
        this.sensorLogServic.get().subscribe((data: SensorLog[]) => {
          this.dataSource.data = data;
          this.dataSource!._updateChangeSubscription();
        });
      });
    });
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
    this.sensorLogServic.get().subscribe((data: SensorLog[]) => {
      this.dataSource = new MatTableDataSource<SensorLog>(data);
      this.dataSource.sort = this.sort;
      this.paginatorLocalizeService.localize(this.paginator);
      this.dataSource.paginator = this.paginator;
    });
  }
}
