import Path, { dirname, isAbsolute, join } from "path";

export function findFileName(filePath: string): string {
  return (
    filePath
      ?.split(
        filePath?.includes(Path.sep)
          ? Path.sep
          : filePath?.includes("/")
          ? "/"
          : "\\"
      )
      ?.pop() ?? ""
  );
}

export function findFilePath(filePath: string): string {
  return filePath.replace(findFileName(filePath), "");
}

export function resolvePath(filePath: string, basePath?: string) {
  if (isAbsolute(filePath)) {
    return filePath;
  } else {
    return join(dirname(basePath), filePath);
  }
}
