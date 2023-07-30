import { render, TemplateContext } from "@asyncapi/generator-react-sdk";
import { IAmqpService } from "../../../components/templates/amqpservice.interface";
import { FileRenderer, Logger } from "../../../utils";

export default function (props: TemplateContext) {
  Logger.info("****** Generating IAmqpService");

  return (
    <FileRenderer name="IAmqpService.cs">
      {render(<IAmqpService {...props} />)}
    </FileRenderer>
  );
}
