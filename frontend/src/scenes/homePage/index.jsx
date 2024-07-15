import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/');
    };

    return (
        <div>
            homePage
            <button onClick={navigateToLogin}>Go to Login</button>
        </div>
    );
};

export default HomePage;
