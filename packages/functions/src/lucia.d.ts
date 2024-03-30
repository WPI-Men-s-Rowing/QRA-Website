// File that defines some types Lucia needs to do what it does. Imported from the auth.ts adapter file

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./auth.ts").Auth;
  type DatabaseUserAttributes = import("./auth.ts").UserDbAttributes;
  type DatabaseSessionAttributes = import("./auth.ts").SessionDbAttributes;
}
