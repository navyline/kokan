'use client';

const AuthError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Authentication Error</h1>
      <p>There was an error during the authentication process.</p>
    </div>
  );
};

export default AuthError;
