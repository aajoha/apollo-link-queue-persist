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
import { ApolloLink, } from "@apollo/client/link/core";
import { Observable } from "@apollo/client/utilities";
export var createGuid = function () {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8(false) + _p8(true) + _p8(true) + _p8(false);
};
var QueueLink = (function (_super) {
    __extends(QueueLink, _super);
    function QueueLink() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.opQueue = [];
        _this.isOpen = true;
        _this.length = function () { return _this.opQueue.length; };
        _this.getQueue = function () { return _this.opQueue; };
        return _this;
    }
    QueueLink.prototype.clear = function () {
        this.opQueue = [];
        QueueLink.listeners = {};
    };
    QueueLink.prototype.isType = function (query, type) {
        return query.definitions.filter(function (e) {
            return e.operation === type;
        }).length > 0;
    };
    QueueLink.prototype.open = function () {
        var _this = this;
        this.isOpen = true;
        var opQueueCopy = __spreadArrays(this.opQueue);
        this.opQueue = [];
        opQueueCopy.forEach(function (entry) {
            _this.triggerListeners(entry, "dequeue");
            entry.forward(entry.operation).subscribe(entry.observer);
        });
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
        return new Observable(function (observer) {
            var operationEntry = { operation: operation, forward: forward, observer: observer };
            _this.enqueue(operationEntry);
            return function () { return _this.cancelOperation(operationEntry); };
        });
    };
    QueueLink.key = function (op, ev) {
        return ("" + op + ev).toLocaleLowerCase();
    };
    QueueLink.prototype.cancelOperation = function (entry) {
        this.opQueue = this.opQueue.filter(function (e) { return e !== entry; });
    };
    QueueLink.prototype.enqueue = function (entry) {
        this.opQueue.push(entry);
        this.triggerListeners(entry, "enqueue");
    };
    QueueLink.prototype.triggerListeners = function (entry, event) {
        var _this = this;
        var key = QueueLink.key(entry.operation.operationName, event);
        if (key in QueueLink.listeners) {
            QueueLink.listeners[key].forEach(function (listener) {
                listener.callback(entry);
            });
        }
        key = QueueLink.key("", "change");
        if (key in QueueLink.listeners) {
            QueueLink.listeners[key].forEach(function (listener) {
                listener.callback(_this.opQueue);
            });
        }
    };
    QueueLink.listeners = {};
    QueueLink.addLinkQueueEventListener = function (opName, event, callback) {
        var _a;
        if (event === "change")
            opName = "";
        var key = QueueLink.key(opName, event);
        var newGuid = createGuid();
        var newListener = (_a = {},
            _a[key] = __spreadArrays((key in QueueLink.listeners ? QueueLink.listeners[key] : []), [{ id: newGuid, callback: callback }]),
            _a);
        QueueLink.listeners = __assign(__assign({}, QueueLink.listeners), newListener);
        return newGuid;
    };
    QueueLink.removeLinkQueueEventListener = function (opName, event, id) {
        if (event === "change")
            opName = "";
        var key = QueueLink.key(opName, event);
        if (QueueLink.listeners[key] !== undefined) {
            QueueLink.listeners[key] = QueueLink.listeners[key].filter(function (listener) { return listener.id !== id; });
            if (QueueLink.listeners[key].length === 0) {
                delete QueueLink.listeners[key];
            }
        }
    };
    return QueueLink;
}(ApolloLink));
export default QueueLink;
//# sourceMappingURL=QueueLink.js.map