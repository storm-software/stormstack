import { render, TemplateContext } from "@asyncapi/generator-react-sdk";
import { AmqpService } from "../../components/templates/amqpservice";
import { FileRenderer, Logger } from "../../utils";

export default function (props: TemplateContext) {
  Logger.info("****** Generating AmqpService");

  return (
    <FileRenderer name="AmqpService.cs">
      {render(<AmqpService {...props} />)}
    </FileRenderer>
  );
}
