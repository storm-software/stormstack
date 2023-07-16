import { Domain, Event, Service } from "@eventcatalog/types";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useZoomPanHelper,
} from "react-flow-renderer";
import { getEventElements, getServiceElements } from "./GraphElements";
import createGraphLayout, { calcCanvasHeight } from "./GraphLayout";

interface CombinedEventsAndServices {
  events: Event[];
  services: Service[];
  name?: string;
}

interface CombinedEventsAndServicesSource {
  data: CombinedEventsAndServices;
  source: "all";
}

interface DomainSource {
  data: Domain;
  source: "domain";
}

interface ServiceSource {
  data: Service;
  source: "service";
}

interface EventSource {
  data: Event;
  source: "event";
}

export type DataSource =
  | CombinedEventsAndServicesSource
  | DomainSource
  | ServiceSource
  | EventSource;

interface NodeGraphBuilderSharedProps {
  title?: string;
  subtitle?: string;
  rootNodeColor?: string;
  maxZoom?: number;
  fitView?: boolean;
  zoomOnScroll?: boolean;
  isAnimated?: boolean;
  isDraggable?: boolean;
  isHorizontal?: boolean;
  includeBackground?: boolean;
  includeEdgeLabels?: boolean;
  includeNodeIcons?: boolean;
}

type NodeGraphBuilderProps = NodeGraphBuilderSharedProps & DataSource;

type NodeGraphProps = NodeGraphBuilderProps & {
  maxHeight?: number | string;
  renderWithBorder?: boolean;
};

// NodeGraphBuilder component wrapping ReactFlow
function NodeGraphBuilder({
  data,
  source,
  rootNodeColor,
  maxZoom = 10,
  isAnimated = true,
  fitView = true,
  zoomOnScroll = false,
  isDraggable = false,
  isHorizontal = true,
  includeBackground = false,
  includeEdgeLabels = false,
  includeNodeIcons,
  title,
  subtitle,
}: NodeGraphBuilderProps) {
  const getElements = useCallback(() => {
    if (source === "domain" || source === "all") {
      const totalEventElements = data.events.map(event =>
        getEventElements(event, rootNodeColor, isAnimated, true, true)
      );
      const totalServiceElements = data.services.map(service =>
        getServiceElements(service, rootNodeColor, isAnimated, true, true)
      );
      const eventsWithServices = totalEventElements
        .flat()
        .concat(totalServiceElements.flat());
      // after we merge make sure all elements are unique for the diagram
      return [
        ...new Map(eventsWithServices.map(item => [item.id, item])).values(),
      ];
    }

    if (source === "event") {
      return getEventElements(
        data as Event,
        rootNodeColor,
        isAnimated,
        includeEdgeLabels,
        includeNodeIcons
      );
    }

    return getServiceElements(
      data as Service,
      rootNodeColor,
      isAnimated,
      includeEdgeLabels,
      includeNodeIcons
    );
  }, [
    data,
    includeEdgeLabels,
    includeNodeIcons,
    isAnimated,
    rootNodeColor,
    source,
  ]);

  const { fitView: resetView } = useZoomPanHelper();

  const [elements, setElements] = useState([]);

  useEffect(() => {
    const elementsForGraph = createGraphLayout(getElements(), isHorizontal);
    setElements(elementsForGraph);
    setTimeout(() => {
      resetView();
    }, 1);
  }, [data, getElements, isHorizontal, resetView]);

  // ReactFlow operations
  const onElementClick = (event, element) =>
    window.open(element.data.link, "_self");
  const onLoad = useCallback(
    reactFlowInstance => {
      if (fitView) {
        reactFlowInstance.fitView();
      }
    },
    [fitView]
  );

  return (
    <ReactFlow
      elements={elements}
      onLoad={onLoad}
      onElementClick={onElementClick}
      nodesDraggable={isDraggable}
      zoomOnScroll={zoomOnScroll}
      maxZoom={maxZoom}>
      {title && (
        <div className="absolute right-4 top-4 z-10 space-x-2 bg-white px-4 py-2 text-lg">
          <span className=" font-bold">{title}</span>
          {subtitle && (
            <>
              <span className="text-gray-200">|</span>
              <span className="font-light">{subtitle}</span>
            </>
          )}
        </div>
      )}
      <Controls className="react-flow__controls-no-shadow absolute top-5 block" />
      {includeBackground && <Background color="#c1c1c1" gap={8} />}
    </ReactFlow>
  );
}

// NodeGraph wrapping NodeGraphBuilder Component
function NodeGraph({
  maxHeight,
  renderWithBorder = true,
  ...builderProps
}: NodeGraphProps) {
  // Set dynamic height of node graph
  const dynamicHeight = maxHeight || calcCanvasHeight(builderProps);

  const borderClasses = `border-dashed border-2 border-slate-300`;
  const ReactFlowProviderComponent = ReactFlowProvider as any;

  return (
    <div
      className={`node-graph h-screen w-full ${
        renderWithBorder ? borderClasses : ""
      }`}
      style={{ height: dynamicHeight }}>
      <ReactFlowProviderComponent>
        <NodeGraphBuilder {...builderProps} />
      </ReactFlowProviderComponent>
      <Link
        className="mt-4 block  text-right text-xs underline"
        href={`/visualiser?type=${builderProps.source}&name=${builderProps.data.name}`}>
        Open in Visualiser &rarr;
      </Link>
    </div>
  );
}

export default NodeGraph;
