var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { ApolloLink } from '@apollo/client/link/core';
import { Observable, } from '@apollo/client/utilities';
var QueueLink = (function (_super) {
    __extends(QueueLink, _super);
    function QueueLink() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.opQueue = [];
        _this.isOpen = true;
        return _this;
    }
    QueueLink.prototype.getQueue = function () {
        return this.opQueue;
    };
    QueueLink.prototype.isType = function (query, type) {
        return query.definitions.filter(function (e) {
            return e.operation === type;
        }).length > 0;
    };
    QueueLink.prototype.isFilteredOut = function (operation) {
        if (!QueueLink.filter || !QueueLink.filter.length)
            return false;
        return operation.query.definitions.filter(function (e) {
            return QueueLink.filter.includes(e.operation);
        }).length > 0;
    };
    QueueLink.prototype.open = function () {
        this.isOpen = true;
        var opQueueCopy = __spreadArrays(this.opQueue);
        this.opQueue = [];
        opQueueCopy.forEach(function (_a) {
            var operation = _a.operation, forward = _a.forward, observer = _a.observer;
            var key = QueueLink.key(operation.operationName, 'dequeue');
            if (key in QueueLink.listeners) {
                QueueLink.listeners[key].forEach(function (listener) {
                    listener({ operation: operation, forward: forward, observer: observer });
                });
            }
            var keyAny = QueueLink.key('any', 'dequeue');
            if (keyAny in QueueLink.listeners) {
                QueueLink.listeners[keyAny].forEach(function (listener) {
                    listener({ operation: operation, forward: forward, observer: observer });
                });
            }
            forward(operation).subscribe(observer);
        });
    };
    QueueLink.key = function (op, ev) {
        return ("" + op + ev).toLocaleLowerCase();
    };
    QueueLink.prototype.close = function () {
        this.isOpen = false;
    };
    QueueLink.prototype.request = function (operation, forward) {
        var _this = this;
        if (this.isOpen) {
            return forward(operation);
        }
        if (operation.getContext().skipQueue) {
            return forward(operation);
        }
        if (this.isFilteredOut(operation)) {
            return forward(operation);
        }
        return new Observable(function (observer) {
            var operationEntry = { operation: operation, forward: forward, observer: observer };
            _this.enqueue(operationEntry);
            return function () { return _this.cancelOperation(operationEntry); };
        });
    };
    QueueLink.prototype.cancelOperation = function (entry) {
        this.opQueue = this.opQueue.filter(function (e) { return e !== entry; });
    };
    QueueLink.prototype.enqueue = function (entry) {
        this.opQueue.push(entry);
        var key = QueueLink.key(entry.operation.operationName, 'enqueue');
        if (key in QueueLink.listeners) {
            QueueLink.listeners[key].forEach(function (listener) {
                listener(entry);
            });
        }
        var keyAny = QueueLink.key('any', 'enqueue');
        if (keyAny in QueueLink.listeners) {
            QueueLink.listeners[keyAny].forEach(function (listener) {
                listener(entry);
            });
        }
    };
    QueueLink.listeners = {};
    QueueLink.filter = null;
    QueueLink.addLinkQueueEventListener = function (opName, event, listener) {
        var _a;
        var key = QueueLink.key(opName, event);
        var newListener = (_a = {},
            _a[key] = __spreadArrays((key in QueueLink.listeners ? QueueLink.listeners[key] : []), [listener]),
            _a);
        QueueLink.listeners = __assign(__assign({}, QueueLink.listeners), newListener);
    };
    QueueLink.setFilter = function (filter) {
        QueueLink.filter = filter;
    };
    return QueueLink;
}(ApolloLink));
export default QueueLink;
//# sourceMappingURL=QueueLink.js.map