import { Request, Response } from "express";
import Driver from "../models/Driver";

export async function getDrivers(req: Request, res: Response): Promise<any> {
    try {
        const drivers = await Driver.findAll();

        return res.json({ data: drivers });
    } catch (error) {
        console.error("Error fetching drivers:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}