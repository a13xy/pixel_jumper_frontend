import { useAuth } from '../hooks/use-auth';
import { useAuthForm } from '../hooks/use-auth-form';
import { passwordResetSchema } from '../schemas';

/**
 * Password reset form component
 * @param {Function} onSuccess - Callback on successful password reset
 * @param {Function} onCancel - Callback to cancel password reset
 */
export function PasswordResetForm({ onSuccess, onCancel }) {
  const { changePassword } = useAuth();
  
  const { 
    formMethods: { register, formState: { errors } },
    isLoading,
    error,
    success,
    onSubmit,
    resetForm,
    setSuccessMessage
  } = useAuthForm(
    passwordResetSchema,
    { 
      login: '', 
      currentPassword: '', 
      newPassword: '', 
      confirmNewPassword: '' 
    },
    async (data) => {
      await changePassword(data.login, data.currentPassword, data.newPassword);
      setSuccessMessage('Password has been successfully changed! Redirecting to login...');
      resetForm();
      
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    }
  );

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>
      
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
          <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            {...register('currentPassword')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !!success}
            placeholder="Enter your current password"
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            {...register('newPassword')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !!success}
            placeholder="At least 8 characters"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <input
            id="confirmNewPassword"
            type="password"
            {...register('confirmNewPassword')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || !!success}
            placeholder="Repeat your new password"
          />
          {errors.confirmNewPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword.message}</p>
          )}
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading || !!success}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading || !!success}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 