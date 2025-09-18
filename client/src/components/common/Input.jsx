const Input = ({ label, name, type = 'text', register, errors, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={name}
          name={name}
          type={type}
          {...register(name)}
          {...props}
          className={`appearance-none block w-full px-3 py-2 border ${
            errors[name] ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors[name] && (
          <p className="mt-2 text-sm text-red-600">{errors[name].message}</p>
        )}
      </div>
    </div>
  );
};

export default Input;