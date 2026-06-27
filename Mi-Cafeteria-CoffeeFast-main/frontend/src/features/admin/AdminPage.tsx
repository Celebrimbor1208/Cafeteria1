import React, { useEffect, useState } from 'react';
import { adminService } from './adminService';
// Usamos "import type" para cumplir estrictamente con verbatimModuleSyntax de TypeScript
import type { ProductoInput, CategoriaInput } from './adminService';
import './AdminPage.css';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'productos' | 'categorias'>('productos');
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  // Estado para el formulario de Productos
  const [prodForm, setProdForm] = useState<ProductoInput>({
    nombre: '', 
    descripcion: '', 
    precio: 0, 
    disponible: true, 
    categoria: { id: 0 }, 
    imagenUrl: ''
  });

  // Estado para el formulario de Categorías
  const [catForm, setCatForm] = useState<CategoriaInput>({
    nombre: '',
    descripcion: ''
  });

  // Cargar datos del backend al iniciar o actualizar
  const cargarDatos = async () => {
    try {
      const resProd = await adminService.listarProductos();
      const resCat = await adminService.listarCategorias();
      setProductos(resProd.data);
      setCategorias(resCat.data);
    } catch (error) {
      console.error("Error cargando datos en el panel de administración:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Controladores de envío (Submit)
  const handleCrearProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prodForm.categoria.id === 0) {
      alert("Por favor, selecciona una categoría válida.");
      return;
    }
    try {
      await adminService.crearProducto(prodForm);
      alert("¡Producto registrado con éxito!");
      cargarDatos(); // Recargar tablas automáticamente
    } catch (error) {
      alert("Error al registrar el producto");
    }
  };

  const handleCrearCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.crearCategoria(catForm);
      alert("¡Categoría registrada con éxito!");
      setCatForm({ nombre: '', descripcion: '' }); // Limpiar formulario
      cargarDatos(); // Recargar tablas automáticamente
    } catch (error) {
      alert("Error al registrar la categoría");
    }
  };

  return (
    <div className="admin-container">
      <h2>Panel de Administración - Coffee Fast</h2>
      
      {/* Pestañas de Navegación */}
      <div className="admin-tabs">
        <button 
          className={activeTab === 'productos' ? 'active' : ''} 
          onClick={() => setActiveTab('productos')}
        >
          Gestionar Productos
        </button>
        <button 
          className={activeTab === 'categorias' ? 'active' : ''} 
          onClick={() => setActiveTab('categorias')}
        >
          Gestionar Categorías
        </button>
      </div>

      {/* Contenido de la pestaña Productos */}
      {activeTab === 'productos' ? (
        <div className="admin-section">
          <h3>Registrar Nuevo Producto</h3>
          <form onSubmit={handleCrearProducto} className="admin-form">
            <input 
              type="text" 
              placeholder="Nombre del producto" 
              onChange={e => setProdForm({...prodForm, nombre: e.target.value})} 
              required 
            />
            <input 
              type="text" 
              placeholder="Descripción" 
              onChange={e => setProdForm({...prodForm, descripcion: e.target.value})} 
            />
            <input 
              type="number" 
              step="0.01" 
              placeholder="Precio (S/.)" 
              onChange={e => setProdForm({...prodForm, precio: parseFloat(e.target.value)})} 
              required 
            />
            <input 
              type="text" 
              placeholder="URL de la Imagen" 
              onChange={e => setProdForm({...prodForm, imagenUrl: e.target.value})} 
            />
            
            {/* Selector dinámico de categorías asociadas */}
            <select 
              onChange={e => setProdForm({...prodForm, categoria: { id: parseInt(e.target.value) }})} 
              required
            >
              <option value="">Selecciona una Categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            <button type="submit" className="btn-guardar">Guardar Producto</button>
          </form>

          <h3>Lista de Productos Activos</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(prod => (
                <tr key={prod.id}>
                  <td>
                    <img 
                      src={prod.imagenUrl || 'https://via.placeholder.com/50'} 
                      alt={prod.nombre} 
                      width="50" 
                      style={{ borderRadius: '4px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{prod.nombre}</td>
                  <td>S/. {prod.precio.toFixed(2)}</td>
                  <td>{prod.categoria?.nombre || 'Sin categoría'}</td>
                  <td>
                    <button 
                      className="btn-eliminar" 
                      onClick={async () => { 
                        if(confirm(`¿Estás seguro de eliminar el producto "${prod.nombre}"?`)) { 
                          await adminService.eliminarProducto(prod.id); 
                          cargarDatos(); 
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Contenido de la pestaña Categorías */
        <div className="admin-section">
          <h3>Registrar Nueva Categoría</h3>
          <form onSubmit={handleCrearCategoria} className="admin-form">
            <input 
              type="text" 
              placeholder="Nombre de la categoría (ej. Postres)" 
              value={catForm.nombre}
              onChange={e => setCatForm({...catForm, nombre: e.target.value})} 
              required 
            />
            <input 
              type="text" 
              placeholder="Descripción corta" 
              value={catForm.descripcion}
              onChange={e => setCatForm({...catForm, descripcion: e.target.value})} 
              required
            />
            <button type="submit" className="btn-guardar">Guardar Categoría</button>
          </form>

          <h3>Lista de Categorías Activas</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map(cat => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.nombre}</td>
                  <td>{cat.descripcion}</td>
                  <td>
                    <button 
                      className="btn-eliminar" 
                      onClick={async () => { 
                        if(confirm(`¿Estás seguro de eliminar la categoría "${cat.nombre}"?`)) { 
                          await adminService.eliminarCategoria(cat.id); 
                          cargarDatos(); 
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};