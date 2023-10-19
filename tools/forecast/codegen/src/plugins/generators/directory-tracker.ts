import { findFileName, findFilePath } from "@stormstack/core-server-utilities";
import {
  BaseUtilityClass,
  NEWLINE_STRING
} from "@stormstack/core-shared-utilities";
import { join } from "path";
import { DIRECTORY_TRACKER_SYMBOL } from "../../types";

export type DirectoryTrackerFile = {
  fullPath: string;
  name: string;
};

export type DirectoryTrackerIndexFile = {
  fileContent: string;
  fileName: string;
};

/**
 * Definition for DirectoryTracker class
 */
export class DirectoryTracker extends BaseUtilityClass {
  private _files: DirectoryTrackerFile[];
  private _childDirectories: DirectoryTracker[];
  private _directoryPath: string;

  constructor(
    directoryPath: string,
    private _includedExtensions: string[] = ["ts", "tsx", "js", "jsx"]
  ) {
    super(DIRECTORY_TRACKER_SYMBOL);

    this._files = [];
    this._childDirectories = [];

    this._directoryPath = directoryPath.replaceAll(/\\/g, "/");
  }

  public get __base(): string {
    return "DirectoryTracker";
  }

  public get files(): DirectoryTrackerFile[] {
    return this._files;
  }

  public get directoryPath(): string {
    return this._directoryPath;
  }

  public addFile = (filePath: string) => {
    const directoryPath = findFilePath(filePath);
    const name = findFileName(filePath);
    if (
      !this._includedExtensions.includes(name.split(".").pop()!) ||
      name === "index.ts"
    ) {
      return;
    }

    let relativePath = directoryPath
      .replaceAll(/\\/g, "/")
      .replace(this._directoryPath, "");
    if (!relativePath || relativePath === "/") {
      this._files.push({
        fullPath: filePath,
        name
      });
    } else if (relativePath) {
      if (
        !this._childDirectories.some(
          childDirectory => childDirectory.directoryPath === relativePath
        )
      ) {
        this._childDirectories.push(
          new DirectoryTracker(relativePath, this._includedExtensions)
        );
      }

      this._childDirectories
        .find(childDirectory => childDirectory.directoryPath === relativePath)
        .addFile(filePath);
    }
  };

  public getIndexFile = (
    indexFiles: DirectoryTrackerIndexFile[] = []
  ): DirectoryTrackerIndexFile[] => {
    if (this._files.length === 0 && this._childDirectories.length === 0) {
      return indexFiles;
    }

    indexFiles.push({
      fileContent:
        this._files
          .map(
            file => `export * from "./${this.removeFileExtension(file.name)}";`
          )
          .join(NEWLINE_STRING) +
        NEWLINE_STRING +
        this._childDirectories
          .map(
            childDirectory =>
              `export * from "./${childDirectory.directoryPath}";`
          )
          .join(NEWLINE_STRING),
      fileName: join(this._directoryPath, "index.ts")
    });

    return this._childDirectories.reduce(
      (ret: DirectoryTrackerIndexFile[], childDirectory: DirectoryTracker) => {
        return childDirectory.getIndexFile(ret);
      },
      indexFiles
    );
  };

  private removeFileExtension = (name: string): string => {
    return this._includedExtensions.reduce((ret, extension) => {
      if (ret.endsWith(`.${extension}`)) {
        return ret.replace(`.${extension}`, "");
      }

      return ret;
    }, name);
  };
}
