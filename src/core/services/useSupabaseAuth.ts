import { useSyncExternalStore } from 'react';
import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';

// Tipo para el perfil de usuario
interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email: string;
  roles: string[];
}

// Estado global de autenticación
interface AuthState {
  session: Session | null;
  profile: UserProfile | null;
  initializing: boolean;
}

// Store global para manejar el estado de autenticación
class AuthStore {
  private state: AuthState = {
    session: null,
    profile: null,
    initializing: true
  };
  
  private listeners = new Set<() => void>();
  private initialized = false;

  constructor() {
    this.initialize();
  }

  // Inicializar el store una sola vez
  private async initialize() {
    if (this.initialized) return;
    this.initialized = true;
    
    console.log("🔧 UseSupabaseAuth: Initializing singleton...");

    // Obtener sesión inicial
    const { data: { session } } = await supabase.auth.getSession();
    console.log("🔐 UseSupabaseAuth: Initial session loaded", !!session);
    
    this.updateState({ session });
    
    // Cargar perfil si hay sesión
    if (session?.user) {
      await this.loadUserProfile(session.user.id, session.user.email || '');
    }
    
    this.updateState({ initializing: false });

    // Escuchar cambios de autenticación
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth state change:", event, !!session);
      
      await this.handleAuthChange(session);
    });
  }

  // Manejar cambios de autenticación
  private async handleAuthChange(session: Session | null) {
    // La fusión del carrito se maneja solo en initialize() para evitar duplicaciones
    // ya que SIGNED_IN se dispara también al cambiar pestañas, minimizar, etc.

    // Actualizar sesión solo si cambió
    const sessionChanged = this.state.session?.user?.id !== session?.user?.id ||
                          this.state.session?.access_token !== session?.access_token;

    if (sessionChanged) {
      console.log("📝 Session updated");
      this.updateState({ session });

      if (session?.user && this.state.profile?.id !== session.user.id) {
        // Cargar perfil para nuevo usuario
        await this.loadUserProfile(session.user.id, session.user.email || '');
      } else if (!session) {
        // Limpiar perfil sin sesión
        console.log("🧹 Clearing profile - no session");
        this.updateState({ profile: null });
      }
    }
  }

  // Cargar perfil del usuario
  private async loadUserProfile(userId: string, userEmail: string) {
    // Evitar cargar si ya está cargado
    if (this.state.profile?.id === userId) {
      console.log("📋 Profile already loaded for user:", userId);
      return;
    }

    try {
      console.log("📋 Fetching profile for user:", userId);

      const { data, error } = await supabase
        .from("profiles")
        .select("*, user_roles(roles(name))")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        const roles = data.user_roles.map((item: { roles: { name: string } }) => item.roles.name);
        const profile: UserProfile = {
          id: data.id,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          email: userEmail,
          roles: roles,
        };

        console.log("✅ Profile loaded - roles:", roles.join(", "));
        this.updateState({ profile });
      }
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      this.updateState({ profile: null });
    }
  }

  // Actualizar estado y notificar listeners
  private updateState(updates: Partial<AuthState>) {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener());
  }

  // Métodos públicos
  getState() {
    return this.state;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

// Instancia única del store
const authStore = new AuthStore();

// Hook principal para usar autenticación
export function useSupabaseAuth() {
  // Sincronizar con el store externo
  const state = useSyncExternalStore(
    (listener) => authStore.subscribe(listener),
    () => authStore.getState()
  );

  // Derivar propiedades de roles
  const isDealership = state.profile?.roles.includes('dealership') ?? false;
  const isInsurance = state.profile?.roles.includes('insurance') ?? false;
  const isAdmin = state.profile?.roles.includes('admin') ?? false;
  const isCustomer = state.profile?.roles.includes('customer') ?? false;

  return {
    session: state.session,
    profile: state.profile,
    initializing: state.initializing,
    isDealership,
    isInsurance,
    isAdmin,
    isCustomer
  };
}