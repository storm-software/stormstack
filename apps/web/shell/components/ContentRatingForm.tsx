"use client";

import {
  MessageTypes,
  SerializablePreloadedQuery,
  useForm,
  useSetNotifications,
} from "@open-system/core-client-data-access";
import { FormProvider } from "@open-system/core-client-form";
import { BaseComponentProps } from "@open-system/design-system-components";
import { Rate } from "@open-system/engagement-client-data-access";
import { ContentRating } from "@open-system/engagement-client-rating";
import { useCallback } from "react";
import { graphql } from "react-relay";
import { ConcreteRequest } from "relay-runtime";
import ClientRatingQueryNode, {
  clientRatingQuery as ClientRatingQueryType,
} from "../__generated__/relay/clientRatingQuery.graphql";
import { pagesRatingQuery as PagesRatingQueryType } from "../__generated__/relay/pagesRatingQuery.graphql";
import { giveRating } from "../actions/engagement";
import { useLiveQuery, useSerializablePreloadedQuery } from "../relay/hooks";
import { getEnvironment } from "../relay/utilities";

interface ContentRatingProps extends BaseComponentProps {
  contentId: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  //queryReference: PreloadedQuery<ClientRatingQueryType, {}>;

  preloadedQuery: SerializablePreloadedQuery<
    ConcreteRequest,
    PagesRatingQueryType
  >;
  // rating: ContentRatingForm_rating$key
}

const RatingFragment = graphql`
  fragment ContentRatingForm_rating on ratings_Rating {
    rate
    count
  }
`;

/*const queryReference = IsServer
  ? null
  : loadQuery<PagesRatingQueryType>(getEnvironment(), RatingFragment, {});*/

export default function ContentRatingForm({
  contentId,
  preloadedQuery,
  ...props
}: ContentRatingProps) {
  /*const preloaded = usePreloadedQuery(
    graphql`
      fragment ContentRatingForm_rating on ratings_Rating {
        rate
        count
      }
    `,
    queryReference
  );*/

  //const fragment = useFragment(RatingFragment, rating)

  const environment = getEnvironment();
  const queryReference = useSerializablePreloadedQuery(
    environment,
    preloadedQuery
  );

  const { data } = useLiveQuery<ClientRatingQueryType>({
    query: ClientRatingQueryNode,
    queryReference,
  });

  const { add: addNotification } = useSetNotifications();
  const handleSuccess = useCallback(() => {
    addNotification({
      type: MessageTypes.SUCCESS,
      message: "You've successfully subscribed to email notifications!",
      link: { text: "Details", href: "/about" },
    });
  }, [addNotification]);

  const { withSubmit, context } = useForm<Rate>({
    initialValues: {
      contentId,
      rate: data.ratings_rating.rate,
    },
    onSuccess: handleSuccess,
  });

  return (
    <FormProvider<Rate> {...context}>
      <form
        className="flex flex-col gap-3"
        {...context.props}
        action={withSubmit(giveRating)}>
        <ContentRating
          contentId="home"
          totalRate={data.ratings_rating.rate}
          count={data.ratings_rating.count}
        />
      </form>
    </FormProvider>
  );
}
