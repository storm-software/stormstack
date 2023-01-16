import { File, render } from "@asyncapi/generator-react-sdk";
import React from "react";
import { ChannelPool } from "../../components/templates/channelpool";

export default function ({ asyncapi, params }) {
  console.log("****** Generating ChannelPool");

  return (
    <File
      name="ChannelPool.cs"
      childrenContent={render(
        <ChannelPool asyncapi={asyncapi} params={params} />
      )}
    />
  );
}
