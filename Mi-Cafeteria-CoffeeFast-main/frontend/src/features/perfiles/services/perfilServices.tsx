import API from '../../../config/axios';
import type { Perfil } from '../../../types';

export const perfilService = {
    listarTodos: async (): Promise<Perfil[]> => {
        const { data } = await API.get<Perfil[]>('/api/perfiles');
        return data;
    },

    cambiarRol: async (id: string, nuevoRol: 'CLIENTE' | 'ADMIN'): Promise<Perfil> => {
        // Coincide con tu @PutMapping("/cambiarRolPerfil/{id}")
        const { data } = await API.put<Perfil>(`/api/perfiles/cambiarRolPerfil/${id}`, { rol: nuevoRol });
        return data;
    },

    eliminar: async (correo: string): Promise<void> => {
        // Coincide con tu @DeleteMapping("/{correo}")
        await API.delete(`/perfiles/${correo}`);
    }
};