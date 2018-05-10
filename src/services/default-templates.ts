import { Template } from 'shared/models';

export const templates = <Template[]>[
  {
    title: 'npm run script',
    command: 'npm.cmd',
    args: 'run script-name'
  },
  {
    title: 'npm start',
    command: 'npm.cmd',
    args: 'start'
  },
  {
    title: 'aurelia build',
    command: 'au.cmd',
    args: 'build',
    startMarker: 'Compiled successfully.',
    errorMarkers: [ 'ERR! Exit status', 'Failed to compile' ],
    progressMarkers: [ 'Compiled successfully.', 'Compiling' ],
  },
  {
    title: 'aurelia run watch',
    command: 'au.cmd',
    args: 'run --watch',
    startMarker: 'Compiled successfully.',
    errorMarkers: [ 'ERR! Exit status', 'Failed to compile' ],
    progressMarkers: [ 'Compiled successfully.', 'Compiling' ],
  },
  {
    title: 'redis server',
    command: 'redis-server.exe',
    startMarker: 'Process is running.',
    progressMarkers: [ 'DB saved on disk' ],
  },
  {
    title: 'dotnet run',
    command: 'dotnet',
    args: 'run',
    startMarker: 'Application started',
    errorMarkers: [ 'The build failed' ],
  },
  {
    title: 'ng build -w',
    command: 'ng.cmd',
    args: 'build -w',
    startMarker: 'Hash',
    errorMarkers: ['ERROR'],
    progressMarkers: ['Hash'],
  },
];
