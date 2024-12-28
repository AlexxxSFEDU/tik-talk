import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'createdAt',
  standalone: true,
})
export class CreatedAtPipe implements PipeTransform {
  transform(value: string | null): string | null {
    if (!value) return null;
    const result = Math.floor(
      (Date.now() - Date.parse(value) - 10800000) / 3600000
    );
    return `${result} часов назад`;
  }
}
