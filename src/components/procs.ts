import { customElement } from 'aurelia-framework';

@customElement('procs')
export class ProcsComponent {
  projects = <Project[]>[
    {
      title: 'body-forge',
      items: [
        {
          title: 'mongodb',
          command: '"C:\\Program Files\\MongoDB\\Server\\3.6\\bin\\mongod.exe" --dbpath "<mongo_path>"'
        }
      ]
    },
    {
      title: 'CPA v1',
      items: [
        {
          title: 'build-dev',
          command: 'npm run build-dev'
        }
      ]
    },
  ];

  showOutput(p) {
    console.log('showOutput', p);
  }
}
export interface Project {
  title: string;
  items?: Process[];
}
export interface Process {
  title: string;
  command: string;
}
