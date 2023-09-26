"use client";

import { SerializablePreloadedQuery } from "@stormstack/core-data-access/types";
import { usePreloadedQuery } from "react-relay";
import { ConcreteRequest, graphql } from "relay-runtime";
import { clientRatingQuery as ClientRatingQueryType } from "../../__generated__/relay/clientRatingQuery.graphql";
import ContentRatingForm from "../../components/ContentRatingForm";
// import PageProvider from "../../components/PageProvider";
import {
  RelayProvider,
  useSerializablePreloadedQuery
} from "../../relay/hooks";
import { getEnvironment } from "../../relay/utilities";

/*export const ClientRatingQuery = graphql`
  query clientRatingQuery {
    ratings_ratings {
      ...ContentRatingForm_details
    }
  }
`;

export const ClientRatingQuery = graphql`
  query clientRatingQuery {
    ratings_rating {
      rate
      count
    }
  }

  export const ClientRatingQuery = graphql`
  query clientRatingQuery {
    ratings_ratings {
      ...ContentRatingForm_details
    }
  }
`;

`;*/

export const ClientRatingQuery = graphql`
  query clientRatingQuery($contentId: String) {
    ratings_rating(contentId: $contentId) {
      ...ContentRatingForm_rating
    }
  }
`;

export default function Client(props: {
  contentId: string;
  preloadedQuery: SerializablePreloadedQuery<
    ConcreteRequest,
    ClientRatingQueryType
  >;
}) {
  /*const repository = await getRepository(connection);
    const result = await repository
      .search()
      .where("contentId")
      .equals(contentId)
      .and("type")
      .equals("like")
      .return.all();*/

  /*if (!process.env.NEXT_PUBLIC_REACTION_QUERY_URL) {
    throw new EnvConfigurationError("NEXT_PUBLIC_REACTION_QUERY_URL");
  }

  const url = new URL(process.env.NEXT_PUBLIC_REACTION_QUERY_URL);
  url.pathname = "/api/reactions";
  url.searchParams.set("contentId", "home");
  url.searchParams.set("type", "like");

  const response = await fetch(url, {
    next: { tags: [DOMAIN_NAME] },
  });
  if (!response.ok) {
    const error = (await response.json()) as HttpErrorResult;
    throw new ApiException(
      response.status,
      error.errorMessage,
      error,
      response.headers
    );

      const result = (await response.json()) as HttpPaginatedResult;
  }*/

  /*const [queryReference, loadQuery] =
    useQueryLoader<PagesRatingQueryType>(PagesRatingQueryNode);
  useEffect(() => {
    loadQuery({ contentId: props.contentId });
  }, [props.contentId, loadQuery]);*/

  const environment = getEnvironment();
  const queryReference = useSerializablePreloadedQuery(
    environment,
    props.preloadedQuery
  );
  const initialRecords = usePreloadedQuery(ClientRatingQuery, queryReference);

  return (
    <RelayProvider initialRecords={initialRecords}>
      <ContentRatingForm
        contentId={props.contentId}
        queryReference={queryReference}
      />
    </RelayProvider>
  );
}
