import React, { useEffect, useState } from 'react';
import { adminService } from './adminService';
import type { ProductoInput, CategoriaInput } from './adminService';
import './AdminPage.css';

export const AdminPage: React.FC = () => {
  // 1. ESTADOS
  const [activeTab, setActiveTab] = useState<'productos' | 'categorias'>('productos');
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [prodForm, setProdForm] = useState<ProductoInput>({
    nombre: '', descripcion: '', precio: 0, disponible: true, categoria: { id: 0 }, imagenUrl: ''
  });
  const [catForm, setCatForm] = useState<CategoriaInput>({ nombre: '', descripcion: '' });
  const [editandoProdId, setEditandoProdId] = useState<number | null>(null);
  const [editandoCatId, setEditandoCatId] = useState<number | null>(null);

  const role = localStorage.getItem('user_role');

  // 2. FUNCIONES
  const cargarDatos = async () => {
    try {
      const resProd = await adminService.listarProductos();
      const resCat = await adminService.listarCategorias();
      setProductos(resProd.data);
      setCategorias(resCat.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const limpiarFormProducto = () => {
    setProdForm({ nombre: '', descripcion: '', precio: 0, disponible: true, categoria: { id: 0 }, imagenUrl: '' });
    setEditandoProdId(null);
  };

  const limpiarFormCategoria = () => {
    setCatForm({ nombre: '', descripcion: '' });
    setEditandoCatId(null);
  };

  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editandoProdId) {
        await adminService.actualizarProducto(editandoProdId, prodForm);
      } else {
        await adminService.crearProducto(prodForm);
      }
      limpiarFormProducto();
      cargarDatos();
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("No se pudo guardar el producto.");
    }
  };

  const guardarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editandoCatId) {
        await adminService.actualizarCategoria(editandoCatId, catForm);
      } else {
        await adminService.crearCategoria(catForm);
      }
      limpiarFormCategoria();
      cargarDatos();
    } catch (error) {
      console.error("Error guardando categoría:", error);
      alert("No se pudo guardar la categoría.");
    }
  };

  const editarProducto = (prod: any) => {
    setEditandoProdId(prod.id);
    setProdForm({
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precio: prod.precio,
      disponible: prod.disponible,
      categoria: { id: prod.categoria?.id || 0 },
      imagenUrl: prod.imagenUrl || ''
    });
  };

  const editarCategoria = (cat: any) => {
    setEditandoCatId(cat.id);
    setCatForm({ nombre: cat.nombre, descripcion: cat.descripcion });
  };

  const eliminarItem = async (id: number, esProducto: boolean) => {
    if (!window.confirm("¿Seguro que deseas eliminar este elemento?")) return;
    try {
      if (esProducto) {
        await adminService.eliminarProducto(id);
      } else {
        await adminService.eliminarCategoria(id);
      }
      cargarDatos();
      alert("Eliminado correctamente");
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo eliminar. ¿Sesión caducada?");
    }
  };

  // 3. EFECTOS
  useEffect(() => {
    cargarDatos();
  }, []);

  // 4. RENDERIZADO
  return (
    <div className="admin-container">
      <h2>Panel de Administración</h2>

      <div className="admin-tabs">
        <button
          className={activeTab === 'productos' ? 'active' : ''}
          onClick={() => setActiveTab('productos')}
        >
          Productos
        </button>
        <button
          className={activeTab === 'categorias' ? 'active' : ''}
          onClick={() => setActiveTab('categorias')}
        >
          Categorías
        </button>
      </div>

      {activeTab === 'productos' && (
        <section className="admin-section">
          <h3>{editandoProdId ? 'Editar producto' : 'Nuevo producto'}</h3>
          <form className="admin-form" onSubmit={guardarProducto}>
            <input
              placeholder="Nombre"
              value={prodForm.nombre}
              onChange={(e) => setProdForm({ ...prodForm, nombre: e.target.value })}
              required
            />
            <input
              placeholder="Descripción"
              value={prodForm.descripcion}
              onChange={(e) => setProdForm({ ...prodForm, descripcion: e.target.value })}
            />
            <input
              type="number"
              placeholder="Precio"
              value={prodForm.precio}
              onChange={(e) => setProdForm({ ...prodForm, precio: parseFloat(e.target.value) || 0 })}
              required
            />
            <select
              value={prodForm.categoria.id}
              onChange={(e) => setProdForm({ ...prodForm, categoria: { id: parseInt(e.target.value) } })}
              required
            >
              <option value={0}>Selecciona categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            <input
              placeholder="URL de imagen"
              value={prodForm.imagenUrl}
              onChange={(e) => setProdForm({ ...prodForm, imagenUrl: e.target.value })}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={prodForm.disponible}
                onChange={(e) => setProdForm({ ...prodForm, disponible: e.target.checked })}
              />
              Disponible
            </label>
            <button type="submit" className="btn-guardar">
              {editandoProdId ? 'Actualizar' : 'Guardar'}
            </button>
            {editandoProdId && (
              <button type="button" onClick={limpiarFormProducto}>Cancelar</button>
            )}
          </form>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos && productos.length > 0 ? (
                productos.map((prod) => (
                  <tr key={prod.id}>
                    <td>{prod.nombre}</td>
                    <td>{prod.categoria?.nombre}</td>
                    <td>S/. {prod.precio?.toFixed(2)}</td>
                    <td>{prod.disponible ? 'Sí' : 'No'}</td>
                    <td>
                      <button onClick={() => editarProducto(prod)}>Editar</button>
                      {role === 'ADMIN' && (
                        <button
                          className="btn-eliminar"
                          onClick={() => eliminarItem(prod.id, true)}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No hay productos para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'categorias' && (
        <section className="admin-section">
          <h3>{editandoCatId ? 'Editar categoría' : 'Nueva categoría'}</h3>
          <form className="admin-form" onSubmit={guardarCategoria}>
            <input
              placeholder="Nombre"
              value={catForm.nombre}
              onChange={(e) => setCatForm({ ...catForm, nombre: e.target.value })}
              required
            />
            <input
              placeholder="Descripción"
              value={catForm.descripcion}
              onChange={(e) => setCatForm({ ...catForm, descripcion: e.target.value })}
            />
            <button type="submit" className="btn-guardar">
              {editandoCatId ? 'Actualizar' : 'Guardar'}
            </button>
            {editandoCatId && (
              <button type="button" onClick={limpiarFormCategoria}>Cancelar</button>
            )}
          </form>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias && categorias.length > 0 ? (
                categorias.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.nombre}</td>
                    <td>{cat.descripcion}</td>
                    <td>
                      <button onClick={() => editarCategoria(cat)}>Editar</button>
                      {role === 'ADMIN' && (
                        <button
                          className="btn-eliminar"
                          onClick={() => eliminarItem(cat.id, false)}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No hay categorías para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};