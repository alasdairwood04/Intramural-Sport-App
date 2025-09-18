import { Link } from "react-router-dom";
import LoginForm from "../features/auth/LoginForm";

const LoginPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div>
            <h2 className="text-2xl font-bold text-center text-gray-900">
                Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
                </Link>
            </p>
            </div>
            <LoginForm />
        </div>
        </div>
    );
}

export default LoginPage;