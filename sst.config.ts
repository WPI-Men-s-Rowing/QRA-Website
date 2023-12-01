import { SSTConfig } from "sst";
import { SiteStack } from "./stacks/SiteStack.ts";

export default {
  config() {
    return {
      name: "qra-website",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(SiteStack);
  },
} satisfies SSTConfig;
