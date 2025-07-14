import { Request, Response } from "express";
import axios from 'axios';

export async function getDirections(req: Request, res: Response): Promise<any> {
    const { origin, destination } = req.query;
    const apiKey = process.env.GOOGLE_API_KEY;

    console.log("Origin:", origin);
    console.log("Destination:", destination);

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json`, {
            params: {
                origin: origin, // Ensure this is a valid coordinate or address
                destination: destination, // Ensure this is a valid coordinate or address
                key: apiKey,
            },
        });
        console.log(JSON.stringify(response.data, null, 2));
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching directions:", error);
        return res.status(500).send('Error fetching directions');
    }
};
