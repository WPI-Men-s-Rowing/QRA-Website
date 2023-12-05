import { Duration } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { StackContext } from "sst/constructs";

/**
 * Creates a stack for the CI/CD deployment flow, including constructs necessary to authenticate for deployment.
 * Note: This does nothing in development environments
 * @param app the application context
 * @param stack the stack context
 * @throws {Error} if the stage is prod and required environment parameters for CI/CD are missing
 */
export function CICDStack({ app, stack }: StackContext) {
  // Only create the provider if it's the production stage (in dev we don't care)
  if (app.stage === "prod") {
    // Validate we have all the environment information we need
    if (
      !process.env.PROD_GITHUB_ORG ||
      !process.env.PROD_GITHUB_REPO ||
      !process.env.PROD_GITHUB_ROLE
    ) {
      throw new Error("Missing required GitHub CI/CD Environment variables");
    }

    const provider = new iam.OpenIdConnectProvider(stack, "GitHub", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
    });

    new iam.Role(stack, "GitHubActionsRole", {
      assumedBy: new iam.OpenIdConnectPrincipal(provider).withConditions({
        StringEquals: {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        },
        StringLike: {
          "token.actions.githubusercontent.com:sub": `repo:${process.env.PROD_GITHUB_ORG}/${process.env.PROD_GITHUB_REPO}:*`,
        },
      }),
      description: "Role assumed for deploying from GitHub CI using AWS CDK",
      roleName: process.env.PROD_GITHUB_ROLE,
      maxSessionDuration: Duration.hours(1),
      // Bare-minimum  access needed by SST to deploy
      inlinePolicies: {
        SSTDeploymentPolicy: new iam.PolicyDocument({
          assignSids: true,
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                "cloudformation:DeleteStack",
                "cloudformation:DescribeStackEvents",
                "cloudformation:DescribeStackResources",
                "cloudformation:DescribeStacks",
                "cloudformation:GetTemplate",
                "cloudformation:ListImports",
                "ecr:CreateRepository",
                "iam:PassRole",
                "iot:Connect",
                "iot:DescribeEndpoint",
                "iot:Publish",
                "iot:Receive",
                "iot:Subscribe",
                "lambda:GetFunction",
                "lambda:GetFunctionConfiguration",
                "lambda:UpdateFunctionConfiguration",
                "s3:ListBucket",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListObjectsV2",
                "s3:CreateBucket",
                "s3:PutBucketPolicy",
                "ssm:DeleteParameter",
                "ssm:GetParameter",
                "ssm:GetParameters",
                "ssm:GetParametersByPath",
                "ssm:PutParameter",
                "sts:AssumeRole",
              ],
              resources: ["*"],
            }),
          ],
        }),
      },
    });
  }
}
