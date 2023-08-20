import Path from "path";

export const findFileName = (filePath: string): string => {
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
};

export const findFilePath = (filePath: string): string => {
  return filePath.replace(findFileName(filePath), "");
};
