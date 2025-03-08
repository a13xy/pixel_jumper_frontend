import { useAuth } from '../hooks/use-auth';
import { useAuthForm } from '../hooks/use-auth-form';
import { signInSchema } from '../schemas';

/**
 * Sign-in form component
 * @param {Function} onSuccess - Callback on successful sign-in
 * @param {Function} onToggleForm - Callback to toggle to sign-up form
 * @param {Function} onForgotPassword - Callback to show password reset form
 */
export function SignInForm({ onSuccess, onToggleForm, onForgotPassword }) {
  const { login } = useAuth();
  
  const { 
    formMethods: { register, formState: { errors } },
    isLoading,
    error,
    success,
    onSubmit,
    setSuccessMessage
  } = useAuthForm(
    signInSchema,
    { login: '', password: '' },
    async (data) => {
      await login(data.login, data.password);
      setSuccessMessage('Login successful! Redirecting...');
      
      setTimeout(() => {
        onSuccess?.();
      }, 500);
    }
  );

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-center mb-6">Sign In</h2>
      
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
            {...register('login')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !!success}
            placeholder="Enter your username"
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
            {...register('password')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !!success}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !!success}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onToggleForm}
            disabled={isLoading || !!success}
            className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none disabled:opacity-50"
          >
            Sign Up
          </button>
        </p>
        
        <button
          type="button"
          onClick={onForgotPassword}
          disabled={isLoading || !!success}
          className="mt-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none disabled:opacity-50"
        >
          Forgot your password?
        </button>
      </div>
    </div>
  );
} 