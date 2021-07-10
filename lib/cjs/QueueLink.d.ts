import { ApolloLink, Operation, FetchResult, NextLink, DocumentNode } from "@apollo/client/link/core";
import { Observer } from "@apollo/client/utilities";
export declare const createGuid: () => string;
export interface OperationQueueEntry {
    operation: Operation;
    forward: NextLink;
    observer: Observer<FetchResult>;
    subscription?: {
        unsubscribe: () => void;
    };
}
declare type OperationTypeNode = 'query' | 'mutation' | 'subscription';
declare type event = "dequeue" | "enqueue" | "change";
interface Listener {
    id: string;
    callback: (entry: any) => void;
}
export default class QueueLink extends ApolloLink {
    static listeners: Record<string, Listener[]>;
    private opQueue;
    private isOpen;
    clear(): void;
    length: () => number;
    isType(query: DocumentNode, type: OperationTypeNode): boolean;
    getQueue: () => OperationQueueEntry[];
    open(): void;
    static addLinkQueueEventListener: (opName: string, event: event, callback: (entry: any) => void) => string;
    static removeLinkQueueEventListener: (opName: string, event: event, id: string) => void;
    close(): void;
    request(operation: Operation, forward: NextLink): any;
    private static key;
    private cancelOperation;
    private enqueue;
    private triggerListeners;
}
export {};
