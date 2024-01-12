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
import { useState } from 'react';
import { clearCart } from '../../store/cart/cart.actions';
import { useNavigate } from 'react-router-dom';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const amount = useSelector(selectCartTotal);
  const currentUser = useSelector(selectCurrentUser);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const dispatch = useDispatch();

  const paymentHandler = async (e) => {
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
    });

    const clientSecret = response.paymentIntent.client_secret;

    // test card number: 4000003560000008
    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
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
