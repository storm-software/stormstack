import { IUploadList } from "../types";

export class UploadList implements IUploadList {
  public length: number = 0;
  [index: number]: File | Blob;

  public [Symbol.iterator](): IterableIterator<File | Blob> {
    return this._files.values();
  }

  constructor(private _files: Map<string, File | Blob>) {
    this.length = this._files.keys.length;

    let index = 0;
    for (const [_, value] of this._files.entries()) {
      this[index++] = value;
    }
  }
}
