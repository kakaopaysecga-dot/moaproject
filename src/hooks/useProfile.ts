import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  dept: string;
  building: string;
  work_area: string | null;
  phone: string | null;
  car_number: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No profile found - this might be a new user
            setProfile(null);
          } else {
            throw error;
          }
        } else {
          setProfile(data);
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    // Legacy compatibility - map profile fields to old User interface
    user: profile ? {
      email: profile.email,
      name: profile.name,
      englishName: profile.name, // fallback
      dept: profile.dept,
      building: profile.building,
      workArea: profile.work_area,
      phone: profile.phone,
      car: profile.car_number,
      isAdmin: false, // To be determined by user_roles
      adminLevel: null
    } : null
  };
}