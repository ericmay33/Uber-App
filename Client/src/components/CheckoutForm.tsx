import React, { useEffect, useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useLocationStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { images } from '../constants';
import CustomButton from './CustomButton';

interface CheckoutFormProps {
    amount: string;
    user: {name: string, email: string, userId: number};
    driverId: number;
    rideTime: number;
}

export default function CheckoutForm({ amount, user, driverId, rideTime }: CheckoutFormProps): React.ReactElement {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const { userAddress, userLongitude, userLatitude, destinationAddress, destinationLatitude, destinationLongitude } = useLocationStore();

    function handleError(error: any): void {
        setLoading(false);
        setErrorMessage(error.message);
        console.log(error)
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        try {
            await elements.submit();

            const response = await axios.post("http://localhost:3000/api/stripe/create-payment-intent", {
                name: user.name,
                email: user.email,
                amount: amount,
            });

            const { client_secret: clientSecret } = response.data;

            console.log('Client secret:', clientSecret);

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: window.location.href,
                },
                redirect: 'if_required',
            });

            if (error) {
                handleError(error);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                console.log(user.userId)
                await axios.post("http://localhost:3000/api/rides/create", {
                    originAddress: userAddress,
                    destinationAddress: destinationAddress,
                    originLatitude: userLatitude,
                    originLongitude: userLongitude,
                    destinationLatitude: destinationLatitude,
                    destinationLongitude: destinationLongitude,
                    rideTime: parseInt(rideTime.toFixed(0)),
                    farePrice: Math.round(parseFloat(amount) * 100),
                    paymentStatus: 'paid',
                    driverId: driverId,
                    userId: user.userId,
                });
                setSuccess(true);
            } else {
                setErrorMessage('Payment processing, please wait...');
            }
        } catch (error: any) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (elements) {
            const paymentElement = elements.create('payment', {
                layout: {
                    type: 'tabs',
                    defaultCollapsed: false,
                },
                defaultValues: {
                    billingDetails: {
                        email: user.email,
                    },
                },
            });

            paymentElement.mount('#payment-element');

            return () => {
                paymentElement.unmount();
            };
        }
    }, [elements]);

    console.log(amount);

    return (
        <>
            {!success && (
                <form onSubmit={handleSubmit}>
                    <div id="payment-element" className="mb-4" />
                    <button type="submit" disabled={!stripe || loading} className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        {loading ? 'Processing...' : 'Submit Payment'}
                    </button>
                    {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
                </form>
            )}

            {success && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="flex flex-col bg-white px-7 py-9 rounded-2xl min-h-[200px] max-w-[400px] text-center justify-center items-center">
                        <img src={images.check} alt="" className="h-28 w-28"/>
                        <p className="text-2xl font-Bold mt-5">Ride Booked!</p>
                        <p className="text-md text-general-200 font-Medium text-center mt-3">Thank you for placing your booking! Please proceed with your trip!</p>
                        <CustomButton 
                            title="Back Home"
                            onPress={() => {
                                setSuccess(false)
                                navigate("/home");
                            }}
                            className="mt-5 p-3 bg-blue-500"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
