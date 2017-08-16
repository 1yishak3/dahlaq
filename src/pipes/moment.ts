import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

/**
 * Generated class for the MomentjsPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'momentjs',
})
export class MomentjsPipe implements PipeTransform {
  /**
   * Takes a date value and returns a pretty string from current time,
   * for instance: "four hours ago" or "in eleven minutes".
   */
  transform(value: string, ...args) {
    return moment(value).fromNow();
    //return value.toLowerCase();
  }
}
