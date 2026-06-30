import API from '../../../config/axios';
import { supabase } from '../../../config/supabase';

export const authService = {
    registrar: async (email: string, password: string, nombre: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: nombre } }
        });
        if (error) throw error;
        return data;
    },

    login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        if (data.session) {
            localStorage.setItem('token', data.session.access_token);
            localStorage.setItem('user_name', data.user.user_metadata.full_name || 'Usuario');
            localStorage.setItem('user_email', email);

            try {
                const res = await API.get(`/api/perfiles/${email}`);
                localStorage.setItem('user_role', res.data.role || res.data.rol || 'CLIENTE');
            } catch (err) {
                console.warn("No se pudo obtener el rol, asignando CLIENTE por defecto");
                localStorage.setItem('user_role', 'CLIENTE');
            }
        }
        return data;
    },

    logout: async () => {
        await supabase.auth.signOut();
        localStorage.clear();
    }
};