import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

  transform(collection: Array<any>, property: string): Array<any> {
    if (!collection) {
      return null;
    }
    return collection.sort((a, b) => b[property] - a[property]);
  }

}
