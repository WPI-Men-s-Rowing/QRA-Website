import { SSTConfig } from "sst";
import { CICDStack } from "./stacks/CICDStack.ts";
import { SiteStack } from "./stacks/SiteStack.ts";

export default {
  // This creates the stack
  config(input) {
    // Validate we have the region if we need it
    if (input.stage === "prod" && !process.env.PROD_AWS_REGION) {
      // Don't allow anything to proceed if we don't have it
      throw new Error(
        "Missing required deployment environment variable PROD_AWS_REGION",
      );
    }

    // Global config
    return {
      name: "qra-website",
      region:
        input.stage === "prod" ? process.env.PROD_AWS_REGION : "us-east-1", // If in dev, just use the US-East region
      profile:
        input.stage === "prod" ? "ianwright-prod" : "ianwright-etshatouhy", // Determine account to use based on input stage
    };
  },
  stacks(app) {
    // Remove all resources (e.g., including DynamoDB/S3 Buckets) in non-prod instances
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }

    app.stack(SiteStack).stack(CICDStack);
  },
} satisfies SSTConfig;
