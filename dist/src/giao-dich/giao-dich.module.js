"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiaoDichModule = void 0;
const common_1 = require("@nestjs/common");
const giao_dich_controller_1 = require("./giao-dich.controller");
const giao_dich_service_1 = require("./giao-dich.service");
let GiaoDichModule = class GiaoDichModule {
};
exports.GiaoDichModule = GiaoDichModule;
exports.GiaoDichModule = GiaoDichModule = __decorate([
    (0, common_1.Module)({
        controllers: [giao_dich_controller_1.GiaoDichController],
        providers: [giao_dich_service_1.GiaoDichService],
    })
], GiaoDichModule);
//# sourceMappingURL=giao-dich.module.js.map