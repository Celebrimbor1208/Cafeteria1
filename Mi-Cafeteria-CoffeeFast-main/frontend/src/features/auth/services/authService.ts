import API from '../../../config/axios';
import { supabase } from '../../../config/supabase';

export const authService = {
    // 1. Registro de usuario
    registrar: async (email: string, password: string, nombre: string) => {
        // Registra en la tabla de autenticación interna de Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: nombre } // Guarda el nombre en la metadata del usuario
            }
        });

        if (error) throw new Error(error.message);

        return data;
    },

    // 2. Inicio de sesión (Login)
    // Modifica la función login dentro de authService.ts
    login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new Error(error.message);

        if (data.session) {
            localStorage.setItem('token', data.session.access_token);
            
            // 1. Extraemos el nombre completo guardado en el registro de Supabase
            const nombre = data.user.user_metadata.full_name || 'Usuario';
            localStorage.setItem('user_name', nombre);

            try {
                // 2. Llamamos a la API de Spring Boot para traer el rol real de PostgreSQL
                const perfilResponse = await API.get(`/api/perfiles/${email}`); 
                localStorage.setItem('user_role', perfilResponse.data.role || 'CLIENTE');
            } catch {
                localStorage.setItem('user_role', 'CLIENTE');
            }
        }

        return data;
    },

    // 3. Cerrar Sesión (Logout)
    logout: async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_role');
    }
};