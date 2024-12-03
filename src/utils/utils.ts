import jwt, { JwtPayload } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || '';

export function getUserIdFromToken(authorizationHeader: string): number | null {
    const token = authorizationHeader.slice(7); // Remove 'Bearer ' from the beginning

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const userId = decoded.user.id;

        return userId;
    } catch (error) {
        console.error('Invalid or expired token:', error);
        return null;
    }
}
