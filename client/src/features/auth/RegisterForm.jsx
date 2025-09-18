import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const RegisterForm = () => {
  const { register: registerUser } = useAuth();
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
            await registerUser(data);
            navigate('/dashboard');
        } catch (error) {
            setServerError('Registration failed. Please try again.');
            console.error('Registration error:', error);
        }
    };

    return ( // to register in user needs to put in email, password, firstName, lastName, studentId
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      {/* Password Field */}
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        {/* First Name Field */}
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            {...register('firstName', { required: 'First Name is required' })}
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>
        {/* Last Name Field */}
        <div>
          <label htmlFor="lastName">Last Name</label>
            <input
                id="lastName"
                type="text"
                {...register('lastName', { required: 'Last Name is required' })}
            />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>
        {/* Student ID Field */}
        <div>
          <label htmlFor="studentId">Student ID</label>
          <input
            id="studentId"
            type="text"
            {...register('studentId', { required: 'Student ID is required' })}
          />
          {errors.studentId && <p className="text-red-500 text-sm">{errors.studentId.message}</p>}
        </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Create Account'}
      </button>
      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
    </form>
  );
};

export default RegisterForm;
