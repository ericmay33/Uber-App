import { Request, Response } from "express";
import User from "../models/User";
import { createHash } from "crypto";
import { createToken, verifyToken } from "../middlewares/authentication";

export async function signUp(req: Request, res: Response): Promise<any> {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Username, Email, and Password are required.' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User with email already exists.' });
        }

        const passwordhash = createHash('sha256').update(password).digest('hex');

        const newUser = await User.create({ name, email, passwordhash });
        const token = createToken(newUser.id);

        return res.status(201).json({ token: token });

    } catch (err) {
        console.error('Error during signup: ', err);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
}


export async function signIn(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password are required.' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const passwordHash = createHash('sha256').update(password).digest('hex');

        if (user.passwordhash !== passwordHash) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        const token = createToken(user.id);

        return res.status(201).json({ token: token });

    } catch (err) {
        console.error('Error during sign in: ', err);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
}

interface UserResponse {
    userId: number,
    name: string,
    email: string,
};

export async function getUser(req: Request, res: Response): Promise<any> {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized request.' });
    }

    try {
        const userId = verifyToken(token); 

        if(!userId) {
           return res.status(401).json({ message: 'Unauthorized request.' });
        }

        const user = await User.findOne({
            attributes: ['name', 'email', 'id'],
            where: {
                id: userId
            },
        });

        if(!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const responseData: UserResponse = {
            userId: user.id,
            name: user.name,
            email: user.email
        };

        return res.status(200).json(responseData);

    } catch (err) {
        console.error('Error during user retrieval: ', err);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
}