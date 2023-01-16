import { File, render } from "@asyncapi/generator-react-sdk";
import React from "react";
import { IAmqpService } from "../../../components/templates/amqpservice.interface";

export default function ({ asyncapi, params }) {
  console.log("****** Generating IAmqpService");

  return (
    <File
      name="IAmqpService.cs"
      childrenContent={render(
        <IAmqpService asyncapi={asyncapi} params={params} />
      )}
    />
  );
}
