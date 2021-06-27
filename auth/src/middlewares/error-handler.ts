import { Request, Response, NextFunction, ErrorRequestHandler} from 'express';
import { CustomError } from '../errors/custom-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { RequestValidationError } from '../errors/request-validation-error';

export const  errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({errors: err.serializeErrors()});
    }
    
    res.status(400).send({
        errors: [{message: 'Something went wrong'}]
    });
};
