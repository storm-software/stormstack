import { File, render } from "@asyncapi/generator-react-sdk";
import React from "react";
import { AmqpService } from "../../../components/templates/amqpservice";

export default function ({ asyncapi, params }) {
  console.log("****** Generating AmqpService");

  return (
    <File
      name="AmqpService.cs"
      childrenContent={render(
        <AmqpService asyncapi={asyncapi} params={params} />
      )}
    />
  );
}
