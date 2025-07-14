import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import CustomButton from './CustomButton';
import type { PaymentProps } from 'typesModule';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_API_KEY);

export default function Payment({
        name,
        email,
        userId,
        amount,
        driverId,
        rideTime
    } : PaymentProps) {

    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const amountInCents = Math.round(Number.parseFloat(amount) * 100);

    console.log('AMOUNT:', amount, 'CENTS:', amountInCents);

    const options = {
        mode: 'payment',
        amount: amountInCents,
        currency: 'usd',
        appearance: {
            theme: 'stripe',
        },
    };

    return (
        <>
            <div className="flex justify-center items-center mt-6">
                <CustomButton 
                    title="Confirm Ride" 
                    className="p-3 w-2/3" 
                    onPress={openModal}
                />
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
                        <Elements stripe={stripePromise} options={options}>
                            <CheckoutForm amount={amount} user={{ name, email, userId }} rideTime={rideTime} driverId={driverId}/>
                        </Elements>
                        <button 
                            onClick={closeModal} 
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
