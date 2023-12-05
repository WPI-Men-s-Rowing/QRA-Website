declare namespace NodeJS {
  /**
   * Override types for process.env
   */
  interface ProcessEnv {
    /**
     * GitHub Organization (readonly) for use in the CI/CD Flow. Optional, but required for CI/CD (when env is prod)
     */
    readonly GITHUB_ORG?: string;

    /**
     * GitHub Repository (readonly) for use in the CI/CD Flow. Optional, but required for CI/CD (when env is prod)
     */
    readonly GITHUB_REPO?: string;

    /**
     * The role used in the GitHub CI/CD flow. Optional, but required for CI/CD (when env is prod)
     */
    readonly GITHUB_ROLE?: string;

    /**
     * The region to use with AWS. This is optional (and ignored) unless the environment is production, at which point is required
     */
    readonly AWS_REGION: string;
  }
}
