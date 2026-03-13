import { supabase } from '../lib/supabase';

export const Login = () => {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="card">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: 'var(--accent)', fontSize: '48px', fontWeight: 'bold', margin: '0 0 8px 0', letterSpacing: '-1px' }}>
            Co-op Education
          </h1>
        </div>
        
        <hr style={{ border: 0, borderTop: '1px solid var(--border)', marginBottom: '32px' }} />

        <button onClick={loginWithGoogle} className="btn-google">
          <img src="https://www.google.com/favicon.ico" width="20" alt="google" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};