const { remote } = (window as any).nodeRequire('electron');
const { readFileSync, writeFileSync } = remote.require('fs');
const { join } = remote.require('path');

export class Store {
  constructor() {
    const userDataPath = remote.app.getPath('userData');
    this.path = join(userDataPath, 'user-data.json');
    this.data = this.parseDataFile(this.path, {});
  }

  path: string;
  data: any;
  preWriteFn: (data: any) => any;

  get(key) {
    return this.data[key];
  }
  set(key, val) {
    this.data[key] = val;

    writeFileSync(
      this.path,
      JSON.stringify(this.preWriteFn
        ? this.preWriteFn(this.data)
        : this.data
      )
    );
  }

  private parseDataFile(filePath: string, defaults) {
    try {
      return JSON.parse(readFileSync(filePath, { encoding: 'utf-8' }));
    } catch (error) {
      return defaults;
    }
  }
}

