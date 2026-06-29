import API from '../../../config/axios';
import type { Producto, Categoria } from '../../../types';

export const catalogoService = {
    listarCategorias: async (): Promise<Categoria[]> => {
        const { data } = await API.get('/api/categorias');
        console.log("Categorias desde BD:", data); // <- Agrega esto
        return data;
    },

    listarProductos: async (): Promise<Producto[]> => {
        const { data } = await API.get('/api/productos');
        console.log("Productos desde BD:", data); // <- Agrega esto
        // Quitamos el .filter temporalmente:
        return data; 
    }
}; 