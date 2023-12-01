import { SSTConfig } from "sst";
import { SiteStack } from "./stacks/SiteStack.ts";

export default {
  config(input) {
    return {
      name: "qra-website",
      region: "us-east-1",
      profile:
        input.stage === "prod" ? "ianwright-prod" : "ianwright-etshatouhy",
    };
  },
  stacks(app) {
    app.stack(SiteStack);
  },
} satisfies SSTConfig;
