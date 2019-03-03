import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanDate',
  pure: true
})
export class HumanDatePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);

      // less than 30 seconds ago will show as 'Just now'
      if (seconds < 29) {
        return 'Just now';
      }

      const dates = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };

      let counter: number | string = 0;
      for (const date in dates) {
        counter = Math.floor(seconds / dates[date]);
        if (counter > 0) {
          return counter === 1 ? `${counter} ${date} ago` : `${counter} ${date}s ago`;
        }
      }
    }
    return value;
  }

}