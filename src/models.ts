import { ChildProcess } from 'child_process';

export interface Project {
  id: string;
  title: string;
  procs?: Process[];
}
export interface Process {
  id: string;
  title: string;
  command: string;
  args: string;
  path: string;
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

export interface ProcessMeta {
  state: ProcStateStrings| string ;
  buffer: string[];
  proc?: ChildProcess;
}

export enum MessageType {
  info,
  data, data_error
}
