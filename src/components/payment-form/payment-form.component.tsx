import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { BUTTON_TYPE_CLASSES } from '../button/button.component';
import {
  FormContainer,
  PaymentButton,
  PaymentFormContainer,
} from './payment-form.styles';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartTotal } from '../../store/cart/cart.selector';
import { selectCurrentUser } from '../../store/user/user.selector';
import { FormEvent, useState } from 'react';
import { clearCart } from '../../store/cart/cart.actions';
import { useNavigate } from 'react-router-dom';
import { StripeCardElement } from '@stripe/stripe-js';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const amount = useSelector(selectCartTotal);
  const currentUser = useSelector(selectCurrentUser);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const dispatch = useDispatch();

  const ifValidCardElement = (
    card: StripeCardElement | null
  ): card is StripeCardElement => card !== null;
  const paymentHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessingPayment(true);

    const response = await fetch('/api/stripe-payment-intent', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amount * 100 }),
    }).then((res) => {
      return res.json();
    }).catch((error) => {
      console.log(error)
    });

    if(!response) {
      alert('There was an error while processing your payment, please retry.');
      setIsProcessingPayment(false);
      return;
    }

    const clientSecret = response.paymentIntent.client_secret;
    const cardDetails = elements.getElement(CardElement);
    if (!ifValidCardElement(cardDetails)) return;
    // test card number: 4000003560000008
    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardDetails,
        billing_details: {
          name: currentUser?.displayName || 'Guest Test',
          // test address
          address: {
            line1: '510 Townsend St',
            postal_code: '98140',
            city: 'San Francisco',
            state: 'CA',
            country: 'US',
          },
        },
      },
    });

    setIsProcessingPayment(false);

    if (paymentResult.error) {
      alert(paymentResult.error.message);
    } else {
      if (paymentResult.paymentIntent.status === 'succeeded') {
        alert('Payment Successful. You will be redirected to the home page!');
        dispatch(clearCart());
        navigate('/');
      }
    }
  };
  return (
    <>
      {amount ? (
        <PaymentFormContainer>
          <FormContainer onSubmit={paymentHandler}>
            <h2>Credit Card Payment: (Test card number: 4000003560000008)</h2>
            <CardElement />
            <PaymentButton
              isLoading={isProcessingPayment}
              disabled={!amount}
              buttonType={BUTTON_TYPE_CLASSES.inverted}
            >
              Pay now
            </PaymentButton>
          </FormContainer>
        </PaymentFormContainer>
      ) : null}
    </>
  );
};

export default PaymentForm;
