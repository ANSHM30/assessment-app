import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';

export interface AuthRequest extends Request {
    user?: any;
}

const authMiddleware = (roles: string[] = []) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        try {
            const decoded = jwt.verify(token, config.JWT_SECRET) as any;
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    };
};

export default authMiddleware;
