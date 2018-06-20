/**
 * Tencent is pleased to support the open source community by making Tars available.
 *
 * Copyright (C) 2016THL A29 Limited, a Tencent company. All rights reserved.
 *
 * Licensed under the BSD 3-Clause License (the "License"); you may not use this file except 
 * in compliance with the License. You may obtain a copy of the License at
 *
 * https://opensource.org/licenses/BSD-3-Clause
 *
 * Unless required by applicable law or agreed to in writing, software distributed 
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR 
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the 
 * specific language governing permissions and limitations under the License.
 */

"use strict";

var assert    = require("assert");
var TarsStream = require("@tars/stream");
var TarsError  = require("@tars/rpc").error;

var tars = tars || {};
module.exports.tars = tars;

tars.AdminFImp = function () { 
    this._name   = undefined;
    this._worker = undefined;
};

tars.AdminFImp.prototype.initialize = function () {};

tars.AdminFImp.prototype.onDispatch = function (current, funcName, binBuffer) { 
    if ("__" + funcName in this) {
        return this["__" + funcName](current, binBuffer);
    } else {
        return TarsError.SERVER.FUNC_NOT_FOUND;
    }
};

var __tars_AdminF$tars_ping$RE = function (_ret) {
    if (this.getRequestVersion() === TarsStream.Tup.TUP_SIMPLE || this.getRequestVersion() === TarsStream.Tup.TUP_COMPLEX) {
        var tup = new TarsStream.UniAttribute();
        tup.tupVersion = this.getRequestVersion();
        tup.writeInt32("", _ret);

        this.doResponse(tup.encode());
    } else {
        var os = new TarsStream.TarsOutputStream();
        os.writeInt32(0, _ret);

        this.doResponse(os.getBinBuffer());
    }
};

tars.AdminFImp.prototype.__tars_ping = function (current) {
    __tars_AdminF$tars_ping$RE.call(current, 0);

    return TarsError.SUCCESS;
};

tars.AdminFImp.prototype.shutdown = function () {
    assert.fail("shutdown function not implemented");
};

var __tars_AdminF$shutdown$RE = function () {
    this.doResponse(new TarsStream.BinBuffer());
};

tars.AdminFImp.prototype.__shutdown = function (current) {
    current.sendResponse = __tars_AdminF$shutdown$RE;

    this.shutdown(current);

    return TarsError.SUCCESS;
};

tars.AdminFImp.prototype.notify = function () {
    assert.fail("notify function not implemented");
};

var __tars_AdminF$notify$RE = function (_ret) {
    if (this.getRequestVersion() === TarsStream.Tup.TUP_SIMPLE || this.getRequestVersion() === TarsStream.Tup.TUP_COMPLEX) {
        var tup = new TarsStream.UniAttribute();
        tup.tupVersion = this.getRequestVersion();
        tup.writeString("", _ret);

        this.doResponse(tup.encode());
    } else {
        var os = new TarsStream.TarsOutputStream();
        os.writeString(0, _ret);

        this.doResponse(os.getBinBuffer());
    }
};

tars.AdminFImp.prototype.__notify = function (current, binBuffer) {
    var command = null;

    if (current.getRequestVersion() === TarsStream.Tup.TUP_SIMPLE || current.getRequestVersion() === TarsStream.Tup.TUP_COMPLEX) {
        var tup = new TarsStream.UniAttribute();
        tup.tupVersion = current.getRequestVersion();
        tup.decode(binBuffer);
        command = tup.readString("command");
    } else {
        var is = new TarsStream.TarsInputStream(binBuffer);
        command = is.readString(1, true, "");
    }

    current.sendResponse = __tars_AdminF$notify$RE;

    this.notify(current, command);

    return TarsError.SUCCESS;
};





