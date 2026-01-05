import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';

export const loginCandidate = async (req: Request, res: Response) => {
    const { email, assessmentCode } = req.body;

    // TODO: Verify assessmentCode and user email against DB
    const user = { id: 'uuid-123', email, role: 'candidate', assessmentId: 'assessment-uuid' };

    const token = jwt.sign(
        { userId: user.id, role: user.role, assessmentId: user.assessmentId },
        config.JWT_SECRET,
        { expiresIn: '4h' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        domain: config.COOKIE_DOMAIN,
        sameSite: 'lax',
        maxAge: 4 * 60 * 60 * 1000 // 4 hours
    });

    res.json({ message: 'Login successful', role: user.role });
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token', { domain: config.COOKIE_DOMAIN });
    res.json({ message: 'Logged out' });
};
