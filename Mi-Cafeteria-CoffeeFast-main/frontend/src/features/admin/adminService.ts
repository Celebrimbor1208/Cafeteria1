import API from '../../config/axios';

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
  listarProductos: () => API.get('/api/productos'),
  crearProducto: (data: ProductoInput) => API.post('/api/productos', data),
  actualizarProducto: (id: number, data: ProductoInput) => API.put(`/api/productos/${id}`, data),
  eliminarProducto: (id: number) => API.delete(`/api/productos/${id}`),

  // CATEGORÍAS
  listarCategorias: () => API.get('/api/categorias'),
  crearCategoria: (data: CategoriaInput) => API.post('/api/categorias', data),
  actualizarCategoria: (id: number, data: CategoriaInput) => API.put(`/api/categorias/${id}`, data),
  eliminarCategoria: (id: number) => API.delete(`/api/categorias/${id}`),
};