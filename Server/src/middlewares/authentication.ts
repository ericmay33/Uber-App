import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: number;
}

export function createToken(userId: number) {
    const JWT_SECRET = process.env.JWT_KEY;

    if (!JWT_SECRET) {
        throw Error('No secret jwt key in .env file.');
    }

    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '6h' });
    return token;
}

export function verifyToken(token: string): number | null {
    const JWT_SECRET = process.env.JWT_KEY;

    if (!JWT_SECRET) {
        throw Error('No secret jwt key in .env file.');
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decodedToken.id;
    } catch (err) {
        console.error('Token verification error:', err);
        return null;
    }
}