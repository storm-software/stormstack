import { render, TemplateContext } from "@asyncapi/generator-react-sdk";
import { Consumers } from "../components/Consumers";
import { Publishers } from "../components/Publishers";
import { Worker } from "../components/Worker";
import { FileRenderer } from "../utils";
import {
  Consumer,
  getChannels,
  GetChannelsResultItem,
  Publisher,
} from "../utils/common";

export default function ({
  asyncapi,
  params,
  originalAsyncAPI,
}: TemplateContext) {
  if (!asyncapi.hasComponents()) {
    return null;
  }

  const publishers: Publisher[] = getChannels(asyncapi).filter(
    (channel: GetChannelsResultItem) => !!channel?.isPublish
  ) as Publisher[];
  const consumers: Consumer[] = getChannels(asyncapi).filter(
    (channel: GetChannelsResultItem) => !channel?.isPublish
  ) as Consumer[];

  return (
    <FileRenderer name="Worker.cs">
      {render(
        <Worker
          asyncapi={asyncapi}
          params={params}
          originalAsyncAPI={originalAsyncAPI}
          childrenContent={
            <>
              {render(<Consumers consumers={consumers} />)}
              {render(<Publishers publishers={publishers} />)}
            </>
          }
        />
      )}
    </FileRenderer>
  );
}
