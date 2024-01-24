// File that defines some types Lucia needs to do what it does. Imported from the lucia.ts adapter file

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./utils/lucia").Auth;
  type DatabaseUserAttributes = import("./utils/lucia").UserDbAttributes;
  type DatabaseSessionAttributes = import("./utils/lucia").SessionDbAttributes;
}
