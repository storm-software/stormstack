/*import Arrow from "../../assets/icons/arrow.json";
import Bell from "../../assets/icons/bell.json";
import Download from "../../assets/icons/download.json";
import ErrorAlert from "../../assets/icons/error-alert.json";
import List from "../../assets/icons/list.json";
import Pencil from "../../assets/icons/pencil.json";
import PostBox from "../../assets/icons/post-box.json";
import Wrench from "../../assets/icons/wrench.json";*/

import { IconTypes } from "./Icon.types";

/*const Download = dynamic(() => import("../../assets/icons/download.json"));
const Pencil = dynamic(() => import("../../assets/icons/pencil.json"));
const Wrench = dynamic(() => import("../../assets/icons/wrench.json"));
const Bell = dynamic(() => import("../../assets/icons/bell.json"));
const List = dynamic(() => import("../../assets/icons/list.json"));
const ErrorAlert = dynamic(() => import("../../assets/icons/error-alert.json"));
const Arrow = dynamic(() => import("../../assets/icons/arrow.json"));
const PostBox = dynamic(() => import("../../assets/icons/post-box.json"));*/

export const getIconData = (type: string): string | undefined => {
  let path = undefined;
  if (type === IconTypes.DOWNLOAD) {
    path = "/static/icons/download.json";
  } else if (type === IconTypes.PENCIL) {
    path = "/static/icons/pencil.json";
  } else if (type === IconTypes.WRENCH) {
    path = "/static/icons/wrench.json";
  } else if (type === IconTypes.BELL) {
    path = "/static/icons/bell.json";
  } else if (type === IconTypes.LIST) {
    path = "/static/icons/list.json";
  } else if (type === IconTypes.ERROR_ALERT) {
    path = "/static/icons/error-alert.json";
  } else if (type === IconTypes.ARROW) {
    path = "/static/icons/arrow.json";
  } else if (type === IconTypes.POST_BOX) {
    path = "/static/icons/post-box.json";
  }

  return path;
};
