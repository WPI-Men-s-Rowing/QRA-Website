import { NextjsSite, StackContext, Table } from "sst/constructs";

/**
 * This method creates a stack for use by the NextJs site, interfacing with other
 * stacks for configuration parameters as necessary
 * @param stack the stack context to use in building this stack
 */
export function SiteStack({ stack }: StackContext) {
  const regattas = new Table(stack, "regattas", {
    // The best practice in DynamoDB is to use completely generic column names as per single
    // table design
    // see (https://electrodb.dev/en/core-concepts/quick-start/)
    fields: {
      pk: "string",
      sk: "string",
      gsi1pk: "string",
      gsi1sk: "string",
      gsi2pk: "string",
      gsi2sk: "string",
    },
    primaryIndex: {
      partitionKey: "pk",
      sortKey: "sk",
    },
    globalIndexes: {
      gsi1: {
        partitionKey: "gsi1pk",
        sortKey: "gsi1sk",
      },
      gsi2: {
        partitionKey: "gsi2pk",
        sortKey: "gsi2sk",
      },
    },
  });

  // Create the nextJS site
  const site = new NextjsSite(stack, "site", {
    path: "packages/site",
    bind: [regattas],
  });

  stack.addOutputs({
    // Add the site output OR revert to localhost if necessary
    SiteUrl: site.url ?? "http://localhost:3000",
  });
}
