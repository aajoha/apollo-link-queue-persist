import { ApolloLink, Operation, FetchResult, NextLink, DocumentNode } from '@apollo/client/link/core';
import { Observer } from '@apollo/client/utilities';
export interface OperationQueueEntry {
    operation: Operation;
    forward: NextLink;
    observer: Observer<FetchResult>;
    subscription?: {
        unsubscribe: () => void;
    };
}
declare type OperationTypeNode = 'query' | 'mutation' | 'subscription';
export default class QueueLink extends ApolloLink {
    static listeners: Record<string, ((entry: any) => void)[]>;
    static filter: OperationTypeNode[];
    private opQueue;
    private isOpen;
    getQueue(): OperationQueueEntry[];
    isType(query: DocumentNode, type: OperationTypeNode): boolean;
    private isFilteredOut;
    open(): void;
    static addLinkQueueEventListener: (opName: string, event: 'dequeue' | 'enqueue', listener: (entry: any) => void) => void;
    static setFilter: (filter: OperationTypeNode[]) => void;
    private static key;
    close(): void;
    request(operation: Operation, forward: NextLink): any;
    private cancelOperation;
    private enqueue;
}
export {};
