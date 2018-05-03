import numeral from 'numeral';

export class NumberValueConverter {
  toView(number: number | null | undefined) {
    if (!number) { return '0'; }
    return numeral(number).format('0.[00]');
  }

  fromView(text: string) {
    return numeral(text).value();    
  }
}
