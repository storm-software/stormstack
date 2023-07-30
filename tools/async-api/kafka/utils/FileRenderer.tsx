import {
  File,
  FileProps,
  FunctionComponent,
} from "@asyncapi/generator-react-sdk";
import { PropsWithChildren } from "react";

export const FileRenderer = File as FunctionComponent<
  PropsWithChildren<FileProps>
>;
