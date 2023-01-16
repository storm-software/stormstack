import { File, render } from "@asyncapi/generator-react-sdk";
import React from "react";
import { Consumers } from "../components/Consumers";
import { Publishers } from "../components/Publishers";
import { Worker } from "../components/Worker";
import { getChannels } from "../utils/common";

export default function ({ asyncapi, params }) {
  if (!asyncapi.hasComponents()) {
    return null;
  }

  const publishers = getChannels(asyncapi).filter(
    (channel: any) => channel.isPublish
  );
  const consumers = getChannels(asyncapi).filter(
    (channel: any) => !channel.isPublish
  );

  return (
    <File
      name="Worker.cs"
      childrenContent={
        (
          <Worker
            asyncapi={asyncapi}
            params={params}
            childrenContent={
              <>
                {render(<Consumers channels={consumers} />)}
                {render(<Publishers channels={publishers} />)}
              </>
            }
          />
        ) as any
      }
    />
  );
}
