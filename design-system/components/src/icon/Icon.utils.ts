import PostBox from "../../../../assets/icons/post-box.json";
import Download from "../../../../assets/icons/download.json";
import Pencil from "../../../../assets/icons/pencil.json";
import Wrench from "../../../../assets/icons/wrench.json";
import Bell from "../../../../assets/icons/bell.json";
import List from "../../../../assets/icons/list.json";

import { IconTypes } from "./Icon.types";


export function getIconData(iconType: string) {
  switch (iconType) {
    case IconTypes.DOWNLOAD:
        return Download;

        case IconTypes.PENCIL:
          return Pencil;

          case IconTypes.WRENCH:
            return Wrench;

            case IconTypes.BELL:
              return Bell;

              case IconTypes.LIST:
                return List;

    case IconTypes.POST_BOX:
    default:
      return PostBox;
  }
}

/*import { IconTypes } from "./Icon.types";
import { import } from "react";

// const ComponentC = dynamic(() => import("../../../assets/icons/post-box.json"), { ssr: false });

export function getIconData(iconType: string) {
  switch (iconType) {
    case IconTypes.POST_BOX:
    default:
      return import("../../../../assets/icons/post-box.json");
  }
}*/
