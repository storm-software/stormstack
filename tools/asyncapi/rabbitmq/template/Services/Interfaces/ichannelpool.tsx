import { render, TemplateContext } from "@asyncapi/generator-react-sdk";
import { IChannelPool } from "../../../components/templates/channelpool.interface";
import { FileRenderer, Logger } from "../../../utils";

export default function (props: TemplateContext) {
  Logger.info("****** Generating IChannelPool");

  return (
    <FileRenderer name="IChannelPool.cs">
      {render(<IChannelPool {...props} />)}
    </FileRenderer>
  );
}
