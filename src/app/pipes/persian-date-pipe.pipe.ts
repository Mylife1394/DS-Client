import { Pipe, PipeTransform } from '@angular/core';
import moment from 'jalali-moment';

@Pipe({
  name: 'jalali',
  standalone: true
})

export class PersianDatePipePipe implements PipeTransform {

  transform(value: any, args?: "Time"|"Date"|"Date_and_Time"): any {
    let MomentDate = moment(value, 'YYYY/MM/DD HH:mm:ss');
    switch (args) {
      case "Date":
        return MomentDate.locale('fa').format('YYYY/M/D');
      case "Time":
        return MomentDate.locale('fa').format('HH:mm:ss');
      case "Date_and_Time":
        return MomentDate.locale('fa').format('HH:mm:ss YYYY/M/D');
    }
    return "Unknown Jalali Pipe Parameter.";
  }

}