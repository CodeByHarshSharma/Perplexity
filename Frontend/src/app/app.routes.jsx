import { createBrowserRouter, Navigate } from 'react-router';
import Login from '../features/auth/pages/Login.jsx';
import Register from '../features/auth/pages/Register.jsx';
import VerifyEmail from '../features/auth/pages/VerifyEmail.jsx';
import Dashboard from '../features/chat/pages/Dashboard.jsx';
import ProtectedRoutes from '../features/auth/components/ProtectedRoutes.jsx';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/verify-email',
        element: <VerifyEmail />
    },
    {
        path: '/',
        element: <ProtectedRoutes>
            <Dashboard />
        </ProtectedRoutes>
    },
    {
        path: '/dashboard',
        element: <Navigate to='/' replace />
    }
])