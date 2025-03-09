import { Pipe, PipeTransform } from '@angular/core';
import {addHours, formatDistanceToNow, parseISO} from 'date-fns';
import { ru } from 'date-fns/locale';

@Pipe({
  name: 'createdAt',
  standalone: true,
})
export class CreatedAtPipe implements PipeTransform {
  transform(value: string | null): string | null {
    if (!value) return null;
    const date = parseISO(value);
    const correctedDate = addHours(date, 3);
    const result = formatDistanceToNow(correctedDate, {
        addSuffix: true,
        locale: ru,
      });
      return result;
    }
}
