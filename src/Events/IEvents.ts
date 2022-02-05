export interface IEvents {
  name: string;
  once: boolean;
  execute(arg: never): void;
}
