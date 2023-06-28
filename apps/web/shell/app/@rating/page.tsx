import { ContentRating } from "@open-system/engagement-feature-rating";
import { ContentRatingForm } from "../../components/content-rating-form";

// export const revalidate = 60;

export default function Page() {
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

  return (
    <div className="fixed right-0 top-0 z-rating flex h-screen w-fit flex-row items-center">
      <ContentRatingForm contentId="home">
        <ContentRating contentId="home" totalRate={4.5} count={74} />
      </ContentRatingForm>
    </div>
  );
}
