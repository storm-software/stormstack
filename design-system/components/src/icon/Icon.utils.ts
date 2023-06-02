import Arrow from "../../assets/icons/arrow.json";
import Bell from "../../assets/icons/bell.json";
import Download from "../../assets/icons/download.json";
import ErrorAlert from "../../assets/icons/error-alert.json";
import List from "../../assets/icons/list.json";
import Pencil from "../../assets/icons/pencil.json";
import PostBox from "../../assets/icons/post-box.json";
import Wrench from "../../assets/icons/wrench.json";

import { IconTypes } from "./Icon.types";

const Download = dynamic(() => import("../../assets/icons/download.json"));
const Pencil = dynamic(() => import("../../assets/icons/pencil.json"));
const Wrench = dynamic(() => import("../../assets/icons/wrench.json"));
const Bell = dynamic(() => import("../../assets/icons/bell.json"));
const List = dynamic(() => import("../../assets/icons/list.json"));
const ErrorAlert = dynamic(() => import("../../assets/icons/error-alert.json"));
const Arrow = dynamic(() => import("../../assets/icons/arrow.json"));
const PostBox = dynamic(() => import("../../assets/icons/post-box.json"));

export const getIconData = async (iconType: string) => {
  if (iconType === IconTypes.DOWNLOAD) {
    //const Download = (await import("../../assets/icons/download.json")).default;
    return Download;
  } else if (iconType === IconTypes.PENCIL) {
    //const Pencil = (await import("../../assets/icons/pencil.json")).default;
    return Pencil;
  } else if (iconType === IconTypes.WRENCH) {
    //const Wrench = (await import("../../assets/icons/wrench.json")).default;
    return Wrench;
  } else if (iconType === IconTypes.BELL) {
    //const Bell = (await import("../../assets/icons/bell.json")).default;
    return Bell;
  } else if (iconType === IconTypes.LIST) {
    //const List = (await import("../../assets/icons/list.json")).default;
    return List;
  } else if (iconType === IconTypes.ERROR_ALERT) {
    //const ErrorAlert = (await import("../../assets/icons/error-alert.json"))
    //  .default;
    return ErrorAlert;
  } else if (iconType === IconTypes.ARROW) {
    //const Arrow = (await import("../../assets/icons/arrow.json")).default;
    return Arrow;
  } else {
    //const PostBox = (await import("../../assets/icons/post-box.json")).default;
    return PostBox;
  }
};
