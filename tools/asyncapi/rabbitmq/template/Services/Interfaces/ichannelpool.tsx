import { File, render } from "@asyncapi/generator-react-sdk";
import React from "react";
import { IChannelPool } from "../../../components/templates/channelpool.interface";

export default function ({ asyncapi, params }) {
  console.log("****** Generating IChannelPool");

  return (
    <File
      name="IChannelPool.cs"
      childrenContent={render(
        <IChannelPool asyncapi={asyncapi} params={params} />
      )}
    />
  );
}
