"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCrudService = void 0;
class PrismaCrudService {
    constructor() {
        this.whereKey = 'id';
    }
    findAll() {
        return this.delegate.findMany({ orderBy: { id: 'desc' } });
    }
    findOne(id) {
        return this.delegate.findUnique({ where: { [this.whereKey]: id } });
    }
    create(data) {
        return this.delegate.create({ data });
    }
    update(id, data) {
        return this.delegate.update({ where: { [this.whereKey]: id }, data });
    }
    remove(id) {
        return this.delegate.delete({ where: { [this.whereKey]: id } });
    }
}
exports.PrismaCrudService = PrismaCrudService;
//# sourceMappingURL=prisma-crud.service.js.map