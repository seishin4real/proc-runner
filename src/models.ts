export interface Project {
  id: string;
  title: string;
  items?: Process[];
}
export interface Process {
  id: string;
  title: string;
  command: string;
  isBatch: boolean;
  meta?: ProcessMeta;
}
export enum ProcState {
  Idle,
  Starting,
  Running,
  Stopping
}
export interface ProcessMeta {
  state: ProcState;
  buffer?: string;
}
