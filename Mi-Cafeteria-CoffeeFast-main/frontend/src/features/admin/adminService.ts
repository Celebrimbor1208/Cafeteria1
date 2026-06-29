import api from '../../config/axios';

export interface ProductoInput {
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
  categoria: { id: number };
  imagenUrl: string;
}

export interface CategoriaInput {
  nombre: string;
  descripcion: string;
}

export const adminService = {
  // PRODUCTOS
  listarProductos: () => api.get('/api/productos'),
  crearProducto: (data: ProductoInput) => api.post('/api/productos', data),
  actualizarProducto: (id: number, data: ProductoInput) => api.put(`/api/productos/${id}`, data),
  eliminarProducto: (id: number) => api.delete(`/api/productos/${id}`),

  // CATEGORÍAS
  listarCategorias: () => api.get('/api/categorias'),
  crearCategoria: (data: CategoriaInput) => api.post('/api/categorias', data),
  actualizarCategoria: (id: number, data: CategoriaInput) => api.put(`/api/categorias/${id}`, data),
  eliminarCategoria: (id: number) => api.delete(`/api/categorias/${id}`),
};