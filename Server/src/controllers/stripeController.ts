import { Request, Response } from "express";
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
    throw Error('No stripe key in .env file');
}

const stripe = new Stripe(stripeKey);

export async function createPayment(req: Request, res: Response): Promise<any> {
    try {
        const { name, email, amount } = req.body;
        console.log('STRIPE ENDPOINT CALLED:', amount)

        if (!name || !email || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Please enter a valid email address and amount' });
        }


        let customer;

        const existingCustomer = await stripe.customers.list({ email });

        if (existingCustomer.data.length > 0) {
            customer = existingCustomer.data[0];
        } else {
            const newCustomer = await stripe.customers.create({
                name, email,
            });

            customer = newCustomer;
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            customer: customer?.id,
            automatic_payment_methods: { enabled: true },
        });

        console.log(paymentIntent.client_secret)

        return res.json({ client_secret: paymentIntent.client_secret, customer_id: customer?.id });
    } catch (error: any) {
        console.error('Error creating payment intent:', error);
        res.status(500).send({ error: error.message });
    }
}