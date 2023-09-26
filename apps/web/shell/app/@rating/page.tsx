/*import { loadSerializableQuery } from "@stormstack/core-data-access/server";*/
// import { graphql } from "react-relay";
import { graphql } from "relay-runtime";
import PagesRatingQueryNode, {
  pagesRatingQuery as PagesRatingQueryType
} from "../../__generated__/relay/pagesRatingQuery.graphql";
import ContentRatingForm from "../../components/ContentRatingForm";
import PageProvider from "../../components/PageProvider";
import { loadSerializableQuery } from "../../relay/utilities";

export const PAGE_ID = "home";
export const revalidate = 0;

export const PagesRatingQuery = graphql`
  query pagesRatingQuery($contentId: String) {
    ratings_rating(contentId: $contentId) {
      ...ContentRatingForm_rating
    }
  }
`;

export default async function Page() {
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

  const preloadedQuery = await loadSerializableQuery<
    typeof PagesRatingQueryNode,
    PagesRatingQueryType
  >(PagesRatingQuery, {
    contentId: PAGE_ID
  });

  /*const response = await fetchSSRQuery<PagesRatingQueryType>(
    PagesRatingQuery,
    {
      contentId: PAGE_ID,
    }
  );*/

  return (
    <div className="right-0 top-0 h-screen w-fit fixed z-rating flex flex-row items-center">
      <PageProvider>
        <ContentRatingForm
          contentId={PAGE_ID}
          preloadedQuery={preloadedQuery}
        />
      </PageProvider>
    </div>
  );
}
