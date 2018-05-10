import { ChildProcess } from 'child_process';

export type ProcStateStrings = 'idle' | 'starting' | 'running' | 'stopping';

export const ProcState = {
  idle: 'idle',
  starting: 'starting',
  running: 'running',
  stopping: 'stopping',
};

export const defaultSettings = <Settings>{
  notifications: {
    positionX: 'center',
    positionY: 'bottom',
    marginX: 5,
    marginY: 5,
    timeout: 6,
  }
};

export interface Settings {
  notifications: {
    positionX: string;
    positionY: string;
    marginX: number,
    marginY: number,
    timeout: number;
  };
}

export interface Project {
  id: string;
  title: string;
  procs?: Process[];
  meta?: ProjectMeta;
}
export interface ProjectMeta {
  isCollapsed?: boolean;
}

export interface Process {
  id: string;
  title: string;
  command: string;
  args: string;
  path: string;
  startMarker: string;
  errorMarkers: string[];
  progressMarkers: string[];
  isBatch: boolean;
  isMute: boolean;
  meta?: ProcessMeta;
}
export interface ProcessMeta {
  state: ProcStateStrings | string;
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

export interface Template {
  title: string;
  command: string;
  args: string;
  startMarker: string;
  errorMarkers: string[];
  progressMarkers: string[];
}
