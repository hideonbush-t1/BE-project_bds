"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NhuCauModule = void 0;
const common_1 = require("@nestjs/common");
const nhu_cau_controller_1 = require("./nhu-cau.controller");
const nhu_cau_service_1 = require("./nhu-cau.service");
let NhuCauModule = class NhuCauModule {
};
exports.NhuCauModule = NhuCauModule;
exports.NhuCauModule = NhuCauModule = __decorate([
    (0, common_1.Module)({
        controllers: [nhu_cau_controller_1.NhuCauController],
        providers: [nhu_cau_service_1.NhuCauService],
    })
], NhuCauModule);
//# sourceMappingURL=nhu-cau.module.js.map