import { notFound } from "next/navigation";

// Ref. https://beta.nextjs.org/docs/routing/defining-routes#catch-all-segments
/**
 * 정의하지 않은 Route 경로를 CatchAll로 받아 404로 Redirect.
 */
export default function NotFoundCatchAll({
  _params,
}: {
  _params: { not_found: string[] };
}) {
  //// How to catch undefined URL routes string
  // console.log(_params["not_found"].join("/"));

  notFound();
}
