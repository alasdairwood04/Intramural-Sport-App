import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const RegisterForm = () => {
  const { register: registerUser } = useAuth(); // get register function from context and rename to avoid conflict
  const navigate = useNavigate(); // to navigate after successful registration
  const [serverError, setServerError] = useState(''); // to handle server errors
  const {
    register, // register function from react-hook-form
    handleSubmit, // handleSubmit function from react-hook-form
    formState: { errors, isSubmitting }, // form state from react-hook-form
  } = useForm(); 

    const onSubmit = async (data) => {
        setServerError('');
        try {
            // backend expects email, password, firstName, lastName, studentId
            const userData = {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                studentId: data.studentId,
            }
            await registerUser(userData); // call the register function from context
            navigate('/dashboard'); // navigate to dashboard on success
        } catch (error) {
            setServerError('Registration failed. Please try again.');
            console.error('Registration error:', error);
        }
    };

    return ( // to register in user needs to put in email, password, firstName, lastName, studentId
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <Input label="Email" name="email" register={register} errors={errors} required />
                <Input label="Password" name="password" type="password" register={register} errors={errors} required />
                <Input label="First Name" name="firstName" register={register} errors={errors} required />
                <Input label="Last Name" name="lastName" register={register} errors={errors} required />
                <Input label="Student ID" name="studentId" register={register} errors={errors} required />
            </div>


        <div className="pt-2">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Create Account'}
            </Button>
        </div>
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
        </form>
  );
};

export default RegisterForm;
