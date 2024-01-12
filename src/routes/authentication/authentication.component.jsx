import SignUpForm from '../../components/sign-up-form/sign-up-form.component';
import SignInForm from '../../components/sign-in-form/sign-in-form.component';

import './authentication.styles.scss';
import { useSelector } from 'react-redux';
import {
  isUserLoading,
  selectCurrentUser,
} from '../../store/user/user.selector';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/spinner/spinner.component';

const Authentication = () => {
  const currentUser = useSelector(selectCurrentUser);
  const isLoading = useSelector(isUserLoading);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='authentication-container'>
          <SignInForm />
          <SignUpForm />
        </div>
      )}
    </>
  );
};

export default Authentication;
