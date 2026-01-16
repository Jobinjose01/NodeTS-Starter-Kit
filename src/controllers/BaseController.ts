import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController<_T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected abstract service: any;

    // Helper method to safely get string param from Express 5
    protected getParamAsString(param: string | string[] | undefined): string {
        if (Array.isArray(param)) {
            return param[0];
        }
        return param || '';
    }

    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const createdItem = await this.service.create(req.body);
            res.status(201).json({
                message: res.__('item.CREATED_SUCCESSFULLY'),
                result: createdItem,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = parseInt(this.getParamAsString(req.params.id));
            const updatedItem = await this.service.update(id, req.body);
            res.status(200).json({
                message: res.__('item.UPDATED_SUCCESSFULLY'),
                result: updatedItem,
            });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'Record not found'
            ) {
                res.status(404).json({ message: res.__('item.NOT_FOUND') });
            } else {
                next(error);
            }
        }
    }

    async delete(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = parseInt(this.getParamAsString(req.params.id));
            await this.service.delete(id);
            res.status(200).json({
                message: res.__('item.DELETED_SUCCESSFULLY'),
            });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'Record not found'
            ) {
                res.status(404).json({ message: res.__('item.NOT_FOUND') });
            } else {
                next(error);
            }
        }
    }

    async getById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = parseInt(this.getParamAsString(req.params.id));
            const item = await this.service.getById(id);
            if (item) {
                res.status(200).json({
                    message: res.__('item.FETCHED_SUCCESSFULLY'),
                    result: item,
                });
            } else {
                res.status(404).json({ message: res.__('item.NOT_FOUND') });
            }
        } catch (error) {
            next(error);
        }
    }

    buildFilters(
        queryParams: Record<string, unknown>,
    ): Record<string, unknown> {
        const filters: Record<string, unknown> = { deletedAt: null };

        Object.keys(queryParams).forEach((key) => {
            if (!['page', 'limit', 'orderBy'].includes(key)) {
                const value = queryParams[key];
                if (value !== undefined && value !== null) {
                    filters[key] =
                        typeof value === 'string' && !isNaN(Number(value))
                            ? Number(value) // Convert numeric strings to numbers
                            : value;
                }
            }
        });

        return filters;
    }

    async getAll(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { page = 1, limit = 20, orderBy, ...queryParams } = req.query;

            const filters = this.buildFilters(queryParams);

            const pagination = {
                page: Number(page),
                limit: Number(limit),
            };

            let sort: Record<string, string> | undefined;
            if (typeof orderBy === 'string') {
                const [key, value] = orderBy.split(':');
                sort = { [key]: value };
            }
            const items = await this.service.getAll(filters, pagination, sort);
            res.status(200).json({
                message: res.__('item.FETCHED_ALL_SUCCESSFULLY'),
                result: items,
            });
        } catch (error) {
            next(error);
        }
    }
}
