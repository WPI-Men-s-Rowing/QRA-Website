// Without this file, the Lucia types get really mad (and that's really annoying), so just make it here with deliberately empty
// interfaces. Anything using this will have to have its own Lucia.d.ts file that overrides this anyway, so all good

/// <reference types="lucia" />
declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Auth {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DatabaseUserAttributes {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DatabaseSessionAttributes {}
}
