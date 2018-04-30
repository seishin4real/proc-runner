import { EventAggregator } from 'aurelia-event-aggregator';
import { customElement } from 'aurelia-framework';

@customElement('procs')
export class ProcsComponent {
  constructor(ea: EventAggregator) {
    ea.subscribe('proc-start', this.procStart.bind(this));
    ea.subscribe('proc-reset', this.procReset.bind(this));
    ea.subscribe('proc-stoprt', this.procStop.bind(this));
  }

  projects = <Project[]>[
    {
      title: 'body-forge',
      items: [
        {
          title: 'mongodb',
          command: '"C:\\Program Files\\MongoDB\\Server\\3.6\\bin\\mongod.exe" --dbpath "<mongo_path>"'
        },
        {
          title: 'server',
          path: 'P:\BodyForge\v3\server',
          command: 'npm start'
        },
        {
          title: 'frontend',
          path: 'P:\BodyForge\v3\webapp',
          command: 'npm start'
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

  procStart(item: Project | Process) {
    console.log('start', item);
    
  }
  
  procReset(item: Project | Process) {
    console.log('reset', item);
    
  }
  
  procStop(item: Project | Process) {
    console.log('stop', item);

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
