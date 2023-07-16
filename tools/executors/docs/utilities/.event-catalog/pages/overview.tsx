import type { Event, Service } from "@eventcatalog/types";
import dynamic from "next/dynamic";
import Head from "next/head";
import ReactDOMServer from "react-dom/server";
import { useConfig } from "../hooks/EventCatalog";
import { getAllEvents, getUniqueServicesNamesFromEvents } from "../lib/events";

export interface PageProps {
  events: Event[];
  services: Service[];
}

const ForceGraph3D = dynamic(
  () => import("react-force-graph-3d").then(module => module.default),
  { ssr: false }
);

function NodeElement({ node: { id } }: { node: { id: string } }) {
  return <div className={`rounded-md p-1 text-center text-sm `}>{id}</div>;
}

const MAX_LENGTH_FOR_NODES = 30;
const truncateNode = value =>
  value.length > MAX_LENGTH_FOR_NODES
    ? `${value.substring(0, MAX_LENGTH_FOR_NODES)}...`
    : value;

function Graph({ events, services }: PageProps) {
  const { title } = useConfig();

  const eventNodes = events.map(({ name: event }) => ({
    id: truncateNode(event),
    group: 1,
    type: "event",
  }));
  const serviceNodes = services.map(service => ({
    id: truncateNode(service),
    group: 2,
    type: "service",
  }));

  // Create all links
  const links = events.reduce((nodes, event) => {
    const { consumerNames = [], producerNames = [], name } = event;
    const consumerNodes = consumerNames.map(consumer => ({
      source: truncateNode(name),
      target: truncateNode(consumer),
    }));
    const producerNodes = producerNames.map(producer => ({
      source: truncateNode(producer),
      target: truncateNode(name),
    }));
    return nodes.concat(consumerNodes).concat(producerNodes);
  }, []);

  const data = { nodes: eventNodes.concat(serviceNodes), links };

  if (typeof window === "undefined") {
    return null;
  }

  const THREE = (window as any)?.THREE;
  if (THREE) {
    const extraRenderers = [new THREE.CSS2DRenderer()];

    return (
      <div className="min-h-screen">
        <Head>
          <title>{title} - 3D Node Graph</title>
        </Head>
        <ForceGraph3D
          extraRenderers={extraRenderers}
          graphData={data}
          nodeAutoColorBy="group"
          nodeRelSize={9}
          nodeThreeObject={node => {
            const nodeEl = document.createElement("div");
            nodeEl.innerHTML = ReactDOMServer.renderToString(
              <NodeElement node={node} />
            );
            node.height = "100px";
            nodeEl.style.color = node.color;

            return new THREE.CSS2DObject(nodeEl);
          }}
          nodeThreeObjectExtend
          enableNodeDrag={false}
          nodeOpacity={0.2}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleColor={() => "rgba(236, 72, 153, 1)"}
        />
      </div>
    );
  } else {
    return (
      <div className="min-h-screen">
        <Head>
          <title>{title} - 3D Node Graph</title>
        </Head>
        <ForceGraph3D
          graphData={data}
          nodeAutoColorBy="group"
          nodeRelSize={9}
          nodeThreeObjectExtend
          enableNodeDrag={false}
          nodeOpacity={0.2}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleColor={() => "rgba(236, 72, 153, 1)"}
        />
      </div>
    );
  }
}

export default Graph;

export const getStaticProps = () => {
  const events = getAllEvents();
  const services = getUniqueServicesNamesFromEvents(events);

  return {
    props: {
      events,

      services: [...new Set(services)],
    },
  };
};
