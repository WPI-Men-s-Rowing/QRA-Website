import { dynamoDbAdapter } from "@qra-website/core/dynamo-db";
import { lucia } from "lucia";

export const auth = lucia({
  env: "DEV",
  adapter: dynamoDbAdapter({
    userAttributes: {
      email: {
        type: "string",
        required: true,
        readOnly: false,
      },
    },
    sessionAttributes: {},
  }),
  getUserAttributes: (user) => user,
  getSessionAttributes: (session) => session,
});

// Auth type to use with Lucia
export type Auth = typeof auth;

// User DB attributes, to provide to Lucia
export interface UserDbAttributes {
  email: string;
}

// Session DB attributes, to provide to Lucia. This is required by Lucia, so it can be empty
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SessionDbAttributes {}
