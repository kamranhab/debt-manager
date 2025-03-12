import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const AuthContext = createContext(undefined);

const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Load preferences from localStorage
const getInitialPreferences = () => {
  try {
    const storedPrefs = localStorage.getItem('user_preferences');
    return storedPrefs ? JSON.parse(storedPrefs) : { 
      currencyPreference: 'INR',
      notificationsEnabled: true
    };
  } catch (error) {
    console.error('Error loading preferences:', error);
    return { 
      currencyPreference: 'INR',
      notificationsEnabled: true
    };
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState(getInitialPreferences());

  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('user_preferences', JSON.stringify(userPreferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }, [userPreferences]);

  useEffect(() => {
    // Check active sessions and sets the user
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signIn = async (email, password) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  };

  const updatePreference = (key, value) => {
    setUserPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        supabase: supabaseClient,
        user,
        loading,
        signUp,
        signIn,
        signOut,
        // Expose preferences and update method
        ...userPreferences,
        updatePreference
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}