import { isSet } from "@open-system/core-shared-utilities/common/type-checks";

export interface AvatarDefaultImageOptions {
  rounded?: boolean;
  bold?: boolean;
  backgroundColor?: string;
  fontColor?: string;
  format?: "svg" | "png";
  size?: number;
}

export const DEFAULT_AVATAR_IMAGE_OPTIONS: Required<AvatarDefaultImageOptions> =
  {
    rounded: true,
    bold: true,
    backgroundColor: "15191e",
    fontColor: "e7e7e7",
    format: "svg",
    size: 128
  };

export const getAvatarDefaultImage = (
  name: string,
  options: AvatarDefaultImageOptions = DEFAULT_AVATAR_IMAGE_OPTIONS
) => {
  const params = new URLSearchParams();
  params.append("name", name);
  params.append(
    "rounded",
    String(
      isSet(options.rounded)
        ? options.rounded
        : DEFAULT_AVATAR_IMAGE_OPTIONS.rounded
    )
  );
  params.append(
    "bold",
    String(
      isSet(options.bold) ? options.bold : DEFAULT_AVATAR_IMAGE_OPTIONS.bold
    )
  );
  params.append(
    "background",
    (options.backgroundColor
      ? options.backgroundColor
      : DEFAULT_AVATAR_IMAGE_OPTIONS.backgroundColor
    ).replaceAll("#", "")
  );
  params.append(
    "color",
    (options.fontColor
      ? options.fontColor
      : DEFAULT_AVATAR_IMAGE_OPTIONS.fontColor
    ).replaceAll("#", "")
  );
  params.append(
    "format",
    options.format ? options.format : DEFAULT_AVATAR_IMAGE_OPTIONS.format
  );
  params.append("length", String(2));
  params.append("uppercase", String(true));
  params.append(
    "size",
    String(options.size ? options.size : DEFAULT_AVATAR_IMAGE_OPTIONS.size)
  );

  return `https://ui-avatars.com/api/?${params.toString()}`;
};
