import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const user = await login(data);
      // Redirect based on user role from response
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setServerError(error.response?.data?.error || 'Invalid email or password.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Email Address" name="email" type="email" register={register} errors={errors} required />
      <Input label="Password" name="password" type="password" register={register} errors={errors} required />
      
      {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}

      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;