type T = string | number | boolean;

declare module 'kevoree-entities' {
  export interface Callback {
    (err?: Error): void;
  }
  export interface Model {}
  export interface Logger {
    info(tag: string, msg?: string): void;
    warn(tag: string, msg?: string): void;
    error(tag: string, msg?: string): void;
    debug(tag: string, msg?: string): void;
    setLevel(level: string|number): void;
    setFilter(tag: string): void;
  }
  export interface Core {
    submitScript(script: string, callback: (err: Error, model: Model) => void): void;
  }
  export interface Dictionary {
    get<T>(name: string, defaultValue: T): T;
    getString(name: string, defaultValue: string|number|boolean): void;
  }
  export interface DictionaryParam {
    optional?: boolean;
    defaultValue?: string|number|boolean;
    fragmentDependant?: boolean;
    datatype?: any;
  }

  export abstract class KevoreeEntity {
    static tdef_version: number;

    log: Logger;
    kCore: Core;
    nodeName: string;
    name: string;
    path: string;
    started: boolean;
    dictionary: Dictionary;

    getKevoreeCore(): Core;
    getNodeName(): string;
    getPath(): string;

    start(done: Callback): void;
    stop(done: Callback): void;
    update(done: Callback): void;

    toString(): string;
  }

  export abstract class AbstractComponent extends KevoreeEntity {}
  export abstract class AbstractNode extends KevoreeEntity {}
  export abstract class AbstractChannel extends KevoreeEntity {}
  export abstract class AbstractGroup extends KevoreeEntity {}

  export interface Port {
    send(msg: string): void;
  }
}
