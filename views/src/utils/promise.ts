type PromiseWithAllSettledResult<T, E> = {
  status: 'fulfilled';
  value: T;
} | {
  status: 'rejected';
  reason: E;
};

export const promiseWithAllSettled = <T, U = T>(promiseHandler: Promise<T>): Promise<PromiseWithAllSettledResult<T, U>> => promiseHandler
  .then(value => ({ status: 'fulfilled' as 'fulfilled', value }))
  .catch(reason => ({ status: 'rejected' as 'rejected', reason }));
