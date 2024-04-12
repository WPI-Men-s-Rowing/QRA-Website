// Type that unwraps an array, inferring the type within the array
export type Unwrapped<T> = T extends (infer U)[] ? U : never;
