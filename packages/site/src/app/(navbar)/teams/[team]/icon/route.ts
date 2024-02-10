/**
 * Endpoint that fetches the image of a team, for use in the (client component) result card
 * @param request the request object from Next.js. Not used
 * @param params the route parameters, notably the team to fetch the icon for
 * @returns the Base-64 image data encoded team icon
 */
export async function GET(
  request: Request,
  { params }: { params: { team: string } },
) {
  // Fetch the SVG data from regatta timing
  const imageData = await fetch(
    `https://www.regattatiming.com/images/org/${params.team.toLowerCase()}.svg`,
  );

  // Now simply serialize it
  return new Response(await imageData.text());
}
