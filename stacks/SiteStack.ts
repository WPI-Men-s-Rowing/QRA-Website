import { NextjsSite, StackContext } from "sst/constructs";

/**
 * This method creates a stack for use by the NextJs site, interfacing with other
 * stacks for configuration parameters as necessary
 * @param stack the stack context to use in building this stack
 */
export function SiteStack({ stack }: StackContext) {
  // Create the nextJS site
  const site = new NextjsSite(stack, "site", {
    path: "packages/site",
  });

  stack.addOutputs({
    // Add the site output OR revert to localhost if necessary
    SiteUrl: site.url ?? "http://localhost:3000",
  });
}
