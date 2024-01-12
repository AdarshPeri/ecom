require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(request, response) {
  try {
    const { amount } = request.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      payment_method_types: ['card'],
      description: 'testing only'
    });

    response.status(200).json({ paymentIntent });
  } catch (error) {
    response.status(400).json({ error });
  }
}
