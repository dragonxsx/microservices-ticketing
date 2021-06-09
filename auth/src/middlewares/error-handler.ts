import { Request, Response, NextFunction, ErrorRequestHandler} from 'express';

export const  errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).send({
        message: err.message
    });
};