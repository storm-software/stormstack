/*import PostBox from "../../../../assets/icons/post-box.json";
import Download from "../../../../assets/icons/download.json";
import Pencil from "../../../../assets/icons/pencil.json";
import Wrench from "../../../../assets/icons/wrench.json";
import Bell from "../../../../assets/icons/bell.json";
import List from "../../../../assets/icons/list.json";
import ErrorAlert from "../../../../assets/icons/error-alert.json";*/

import { IconTypes } from "./Icon.types";

export const getIconData = (iconType: string) => {
  switch (iconType) {
    case IconTypes.DOWNLOAD:
      const Download = import("../../../../assets/icons/download.json").then(mod => mod.default);
      return Download;

    case IconTypes.PENCIL:
      const Pencil = import("../../../../assets/icons/pencil.json").then(mod => mod.default);
      return Pencil;

    case IconTypes.WRENCH:
      const Wrench = import("../../../../assets/icons/wrench.json").then(mod => mod.default);
      return Wrench;

    case IconTypes.BELL:
      const Bell = import("../../../../assets/icons/bell.json").then(mod => mod.default);
      return Bell;

    case IconTypes.LIST:
      const List = import("../../../../assets/icons/list.json").then(mod => mod.default);
      return List;

    case IconTypes.ERROR_ALERT:
      const ErrorAlert = import("../../../../assets/icons/error-alert.json").then(mod => mod.default);
      return ErrorAlert;

    case IconTypes.ARROW:
      const Arrow = import("../../../../assets/icons/arrow.json").then(mod => mod.default);
      return Arrow;

    case IconTypes.POST_BOX:
    default:
      const PostBox = import("../../../../assets/icons/post-box.json").then(mod => mod.default);
      return PostBox;
  }
};
