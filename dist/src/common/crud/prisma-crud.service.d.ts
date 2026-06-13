export declare abstract class PrismaCrudService {
    protected whereKey: string;
    protected abstract get delegate(): {
        findMany: (args?: any) => Promise<any[]>;
        findUnique: (args: any) => Promise<any>;
        create: (args: any) => Promise<any>;
        update: (args: any) => Promise<any>;
        delete: (args: any) => Promise<any>;
    };
    findAll(): Promise<any[]>;
    findOne(id: string | number): Promise<any>;
    create(data: any): Promise<any>;
    update(id: string | number, data: any): Promise<any>;
    remove(id: string | number): Promise<any>;
}
