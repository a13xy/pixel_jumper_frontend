import { useAuth } from '../hooks/use-auth';
import { useAuthForm } from '../hooks/use-auth-form';
import { signUpSchema } from '../schemas';

/**
 * Sign-up form component
 * @param {Function} onSuccess - Callback on successful sign-up
 * @param {Function} onToggleForm - Callback to toggle to sign-in form
 */
export function SignUpForm({ onSuccess, onToggleForm }) {
  const { register } = useAuth();
  
  const { 
    formMethods: { register: registerField, formState: { errors } },
    isLoading,
    error,
    success,
    onSubmit,
    setSuccessMessage
  } = useAuthForm(
    signUpSchema,
    { login: '', password: '', confirmPassword: '' },
    async (data) => {
      await register(data.login, data.password);
      setSuccessMessage('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    }
  );

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="login" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="login"
            type="text"
            {...registerField('login')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !!success}
            placeholder="At least 5 characters"
          />
          {errors.login && (
            <p className="mt-1 text-sm text-red-600">{errors.login.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...registerField('password')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !!success}
            placeholder="At least 8 characters"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...registerField('confirmPassword')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !!success}
            placeholder="Repeat your password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !!success}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleForm}
            disabled={isLoading || !!success}
            className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none disabled:opacity-50"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
} 