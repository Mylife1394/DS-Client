import { OnInit, Pipe, PipeTransform } from '@angular/core';
import { LocalizationString, LocalizationStringService } from '../services/localization-string.service';
import { localizationStrings } from '../app.module';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  constructor(private localizationStringService: LocalizationStringService) { 
  }

  transform(value: string, ...args: unknown[]): string {
    return this.translate(value);
  }

  translate(str:string):string{
    let result = str;
    localizationStrings.forEach(ls => {
      if (ls.strKey.toUpperCase() == str.toUpperCase()){
        result = ls.strValue;
        return false;
      }
      return true;
    });

    return result;
  }
}
