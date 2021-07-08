import { ApolloClient, InMemoryCache } from '@apollo/client';
import QueueLink from '../QueueLink';
import { ApolloPersistOptions, PersistedData } from './types';
export default class Queue<T> {
    queueLink: QueueLink;
    serialize: boolean;
    client: ApolloClient<InMemoryCache>;
    constructor(options: ApolloPersistOptions<T>);
    extract(): PersistedData<T>;
    restore(data: PersistedData<T>): void;
}
