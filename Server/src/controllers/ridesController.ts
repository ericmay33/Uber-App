import Ride from '../models/Ride';
import Driver from '../models/Driver';
import { Request, Response } from "express";

export async function createRide(req: Request, res: Response): Promise<any> {
    try {
        const {
            originAddress, 
            destinationAddress, 
            originLatitude, 
            originLongitude, 
            destinationLatitude, 
            destinationLongitude, 
            rideTime, 
            farePrice, 
            paymentStatus, 
            driverId, 
            userId, 
        } = req.body;

        console.log('createRide request body:', req.body);

        if (
            !originAddress ||
            !destinationAddress ||
            !originLatitude ||
            !originLongitude ||
            !destinationLatitude ||
            !destinationLongitude ||
            !rideTime ||
            !farePrice ||
            !paymentStatus ||
            !driverId ||
            !userId
        ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newRide = await Ride.create({
            originAddress,
            destinationAddress,
            originLatitude,
            originLongitude,
            destinationLatitude,
            destinationLongitude,
            rideTime,
            farePrice,
            paymentStatus,
            driverId,
            userId,
        });

        return res.status(201).json({ data: newRide });
    } catch (error) {
        console.error("Error inserting data into rides:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getRidesByUserId(req: Request, res: Response): Promise<any> {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const rides = await Ride.findAll({
            where: { userId: id },
            include: [{
                model: Driver,
                attributes: ['id', 'firstName', 'lastName', 'profileImageUrl', 'carImageUrl', 'carSeats', 'rating'],
            }],
            order: [['createdAt', 'DESC']],
        });

        return res.json({ data: rides });
    } catch (error) {
        console.error("Error fetching recent rides:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
