"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadErrorRequest = void 0;
var custom_error_1 = require("./custom-error");
var BadErrorRequest = /** @class */ (function (_super) {
    __extends(BadErrorRequest, _super);
    function BadErrorRequest(message) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = 400;
        //this line only becasue we are extending a built in class
        Object.setPrototypeOf(_this, BadErrorRequest.prototype);
        return _this;
    }
    BadErrorRequest.prototype.serializeErrors = function () {
        return [{ message: this.message }];
    };
    return BadErrorRequest;
}(custom_error_1.CustomError));
exports.BadErrorRequest = BadErrorRequest;
