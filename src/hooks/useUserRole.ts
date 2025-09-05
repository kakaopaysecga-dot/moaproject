import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

type UserRole = 'admin' | 'moderator' | 'user';

export function useUserRole() {
  const { user } = useAuthStore();
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole('user');
      setIsLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No role found - default to user
            setRole('user');
          } else {
            console.error('Error fetching user role:', error);
            setRole('user');
          }
        } else {
          setRole(data.role);
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setRole('user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return {
    role,
    isLoading,
    isAdmin: role === 'admin',
    isModerator: role === 'moderator',
    isUser: role === 'user'
  };
}