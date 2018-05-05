import { ChildProcess } from 'child_process';

export interface Project {
  id: string;
  title: string;
  procs?: Process[];
  meta?: ProjectMeta;
}
export interface Process {
  id: string;
  title: string;
  command: string;
  args: string;
  path: string;
  startMarker: string;
  errorMarkers: string[];
  isBatch: boolean;
  meta?: ProcessMeta;
}
export type ProcStateStrings = 'idle' | 'starting' | 'running' | 'stopping';

export const ProcState = {
  idle: 'idle',
  starting: 'starting',
  running: 'running',
  stopping: 'stopping',
};

export interface ProjectMeta {
  isCollapsed?: boolean;
}

export interface ProcessMeta {
  state: ProcStateStrings| string ;
  buffer: string[];
  proc?: ChildProcess;
  isCollapsed?: boolean;
}

export enum MessageType {
  info,
  success,
  warning,
  data, error
}
