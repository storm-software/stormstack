import {
  InputAutoCompleteTypes,
  InputTypes,
} from "@open-system/design-system-components";
import { Input, InputProps } from "../input";

export type UrlInputProps = Partial<Omit<InputProps, "min" | "max">>;

export function UrlInput(props: UrlInputProps) {
  return (
    <Input
      name="url"
      label="URL"
      type={InputTypes.URL}
      autoComplete={InputAutoCompleteTypes.URL}
      pattern={{
        value: new RegExp(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        ),
        message: "Invalid URL format provided.",
      }}
      maxLength={500}
      {...props}
    />
  );
}
