import { NextjsSite, StackContext } from "sst/constructs";

export function SiteStack({ stack }: StackContext) {
  const site = new NextjsSite(stack, "site", {
    path: "packages/site",
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
