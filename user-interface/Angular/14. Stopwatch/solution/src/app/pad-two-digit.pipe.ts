import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'padTwoDigit',
})
export class PadTwoDigitPipe implements PipeTransform {
  transform(value: number): string {
    const hundredths = Math.floor(value / 10);
    return hundredths >= 10 ? String(hundredths) : `0${hundredths}`;
  }
}
