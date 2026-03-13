import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import type { UserProfile } from '../types/auth';

export const Dashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        try {
          const response = await axios.get('http://localhost:3000/profile', {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          });
          setProfile(response.data);
        } catch (err) {
          console.error("Backend Error:", err);
        }
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {profile ? (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p>Logged in as: <strong>{profile.email}</strong></p>
          <p>Your Role: <span className="px-2 py-1 bg-blue-500 text-white rounded text-sm">{profile.role}</span></p>
        </div>
      ) : <p>Loading profile from NestJS...</p>}
      
      <button 
        onClick={() => supabase.auth.signOut()}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};