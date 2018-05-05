export class RemoveCmdValueConverter {
  toView(value: string) {
    if (value.substr(-4).toLowerCase() === '.cmd') {
      return value.substr(0, value.length - 4);
    }
    return value;
  }
}
