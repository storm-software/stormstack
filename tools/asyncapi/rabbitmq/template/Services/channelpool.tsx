import { render, TemplateContext } from "@asyncapi/generator-react-sdk";
import { ChannelPool } from "../../components/templates/channelpool";
import { FileRenderer, Logger } from "../../utils";

export default function (props: TemplateContext) {
  Logger.info("****** Generating ChannelPool");

  return (
    <FileRenderer name="ChannelPool.cs">
      {render(<ChannelPool {...props} />)}
    </FileRenderer>
  );
}
