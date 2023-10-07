import { ProcessingError } from "../errors";
import { isFunction, isObject } from "./type-checks";

export interface IPipeline {
  send(traveler: any): Pipeline;
  next(pipe: Pipe): Pipeline;
  through(pipes: Pipes): Pipeline;
  via(method: string): Pipeline;
  then(destination: any): any;
}

export type Pipe = IPipeline | Function;
export type Pipes = Array<Pipe>;

export class Pipeline implements IPipeline {
  protected traveler: any;
  protected pipes: Pipes = [];
  protected method: string = "handle";

  public send = (traveler: any): this => {
    this.traveler = traveler;

    return this;
  };

  public next = (pipe: Pipe): this => {
    this.pipes.push(pipe);

    return this;
  };

  public through = (pipes: Pipes): this => {
    this.pipes = pipes;

    return this;
  };

  public via = (method: string): this => {
    this.method = method;

    return this;
  };

  public then = (destination: any): any => {
    try {
      this.pipes.unshift(this.traveler);

      for (const pipe of this.pipes) {
        this.traveler = this.carry(pipe);
      }
    } catch (error) {
      console.error("Error", error);
      throw error;
    }

    return this.carry(destination);
  };

  protected carry = (pipe: Pipe): any => {
    let cursor: any = pipe;

    if (isFunction(pipe)) {
      cursor = pipe();
    } else if (isObject(pipe)) {
      if (!isFunction((pipe as any)?.[this.method])) {
        throw new ProcessingError(
          `Method undefined at: ${pipe}:${this.method}.`
        );
      }

      cursor = (pipe as any)?.[this.method]();
    }

    return cursor;
  };
}
