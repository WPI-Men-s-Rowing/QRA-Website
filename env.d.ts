declare namespace NodeJS {
  /**
   * Override types for process.env
   */
  interface ProcessEnv {
    /**
     * GitHub Organization (readonly) for use in the CI/CD Flow. Optional, but required for CI/CD (when env is prod)
     */
    readonly PROD_GITHUB_ORG?: string;

    /**
     * GitHub Repository (readonly) for use in the CI/CD Flow. Optional, but required for CI/CD (when env is prod)
     */
    readonly PROD_GITHUB_REPO?: string;

    /**
     * The role used in the GitHub CI/CD flow. Optional, but required for CI/CD (when env is prod)
     */
    readonly PROD_GITHUB_ROLE?: string;

    /**
     * The region to use with AWS. This is optional (and ignored) unless the environment is production, at which point is required
     */
    readonly PROD_AWS_REGION?: string;

    /**
     * Whether we are in the deploy prep stage, e.g., if this is defined the site will not be deployed.
     * This is to enable dependent resources (e.g., DynamoDB and S3) to be built before the Site needs them
     */
    readonly PROD_DEPLOY_PREP_STAGE?: string;
  }
}
