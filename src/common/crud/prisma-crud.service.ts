export abstract class PrismaCrudService {
  protected whereKey = 'id';

  protected abstract get delegate(): {
    findMany: (args?: any) => Promise<any[]>;
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
  };

  findAll() {
    return this.delegate.findMany({ orderBy: { [this.whereKey || 'id']: 'desc', } });
  }

  findOne(id: string | number) {
    return this.delegate.findUnique({ where: { [this.whereKey]: id } });
  }

  create(data: any) {
    return this.delegate.create({ data });
  }

  update(id: string | number, data: any) {
    return this.delegate.update({ where: { [this.whereKey]: id }, data });
  }

  remove(id: string | number) {
    return this.delegate.delete({ where: { [this.whereKey]: id } });
  }
}