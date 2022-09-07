/* eslint-disable no-unused-vars */
declare type AsyncReturnType<T> = ReturnType<T> extends Promise<infer U> ? U: never;
