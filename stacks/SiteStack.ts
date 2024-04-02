import { NextjsSite, Script, StackContext, Table } from "sst/constructs";

/**
 * This method creates a stack for use by the NextJs site, interfacing with other
 * stacks for configuration parameters as necessary
 * @param stack the stack context to use in building this stack
 */
export function SiteStack({ stack }: StackContext) {
  // Creates the DynamoDB Database
  const database = new Table(stack, "database", {
    // The best practice in DynamoDB is to use completely generic column names as per single
    // table design
    // see (https://electrodb.dev/en/core-concepts/quick-start/)
    fields: {
      pk: "string",
      sk: "string",
      gsi1pk: "string",
      gsi1sk: "string",
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
    },
  });

  // Script to handle seeding the database. Only create it if the mode is not production (because we obviously don't want to seed prod...)
  if (stack.stage !== "prod") {
    new Script(stack, "databaseSeedScript", {
      defaults: {
        function: {
          bind: [database],
        },
      },
      onCreate: "packages/functions/src/databaseSeed.script",
    });
  }

  // Create the nextJS site, deploy the site
  const site = new NextjsSite(stack, "site", {
    // If it's prod and the prod prep stage, deploy the maintenance site instead of the real site
    // This is a much better double deploy than destroying all of the site resources and rebuilding them
    path: !(stack.stage === "prod" && process.env.PROD_DEPLOY_PREP_STAGE)
      ? "packages/site"
      : "packages/maintenance",
    bind: [database],
  });

  stack.addOutputs({
    // Add the site output OR revert to localhost if necessary
    SiteUrl: site.url ?? "http://localhost:3000",
  });
}
