import { Request, Response, NextFunction } from 'express';
import * as v from 'valibot';

export const validate = (schema: v.GenericSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // parse akan membuang field yang tidak ada di schema secara otomatis
            req.body = v.parse(schema, req.body);
            next();
        } catch (error: any) {
            res.status(400).json({
                status: 'fail',
                errors: error.issues.map((i: any) => ({ field: i.path[0].key, msg: i.message }))
            });
        }
    };