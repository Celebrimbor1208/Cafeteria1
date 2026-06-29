import { useState, useEffect } from 'react';
import { authService } from '../auth/services/authService';
import type { Producto, Categoria, ItemCarrito } from '../../types';
import { catalogoService } from './services/catalogoService';
import './catalogo.css';
import { useNavigate } from 'react-router-dom';


// @ts-ignore

import api from "../../api";

const cargarProductos = async () => {
    const response = await api.get("/productos");
    console.log(response.data);
}
// Productos de respaldo por si tu Base de Datos/Backend viene vacía

const PRODUCTOS_MOCK: any[] = [    {

        id: 101,

        nombre: 'Espresso Intenso',

        descripcion: 'Un shot de café puro extraído con precisión, destacando notas de chocolate amargo.',

        precio: 7.50,

        imagenUrl: 'https://images.unsplash.com/photo-1510972527409-cca19de31749?q=80&w=500',

        categoria: { id: 1, nombre: 'Bebidas Calientes' }

    },

    {

        id: 102,

        nombre: 'Café Latte Cremoso',

        descripcion: 'Espresso balanceado con leche vaporizada sedosa y una delicada capa de microespuma.',

        precio: 11.90,

        imagenUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=500',

        categoria: { id: 1, nombre: 'Bebidas Calientes' }

    },

    {
        id: 103,
        nombre: 'Cappuccino Tradicional',
        descripcion: 'Partes iguales de espresso, leche y abundante espuma, espolvoreado con cacao.',
        precio: 12.50,
        imagenUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=500',
        categoria: { id: 1, nombre: 'Bebidas Calientes' }
    },
    {
        id: 104,
        nombre: 'Croissant de Mantequilla',
        descripcion: 'Hojaldre clásico francés, crujiente por fuera y tierno por dentro, horneado hoy.',
        precio: 6.90,
        imagenUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=500',
        categoria: { id: 2, nombre: 'Pastelería' }
    }

];



export default function CatalogoPage() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categoriaActiva, setCategoriaActiva] = useState<number | 'ALL'>('ALL');
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [usuarioLogueado, setUsuarioLogueado] = useState<{ nombre: string; rol: string } | null>(() => {
        const token = localStorage.getItem('token');
        const nombre = localStorage.getItem('user_name');
        const rol = localStorage.getItem('user_role');
        if (token && nombre) {
            return { nombre, rol: rol || 'CLIENTE' };
        }
        return null;
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodData, catData] = await Promise.all([
                    catalogoService.listarProductos(),
                    catalogoService.listarCategorias()
                ]);
                setProductos(prodData);
                setCategorias(catData);
            } catch (error) {
                console.error("Error cargando el catálogo", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Lógica al presionar el ícono de Perfil
    const handleProfileClick = () => {
        if (usuarioLogueado) {
            setIsDropdownOpen(!isDropdownOpen);
        } else {
            navigate('/login');
        }
    };

    // Cerrar Sesión
    const handleLogout = async () => {
        try {
            await authService.logout();
            setUsuarioLogueado(null);
            setIsDropdownOpen(false);
            window.location.reload();
        } catch {
            alert("Error al cerrar sesión");
        }
    };

    // Carrito
    const agregarAlCarrito = (producto: Producto) => {
        setCarrito(prev => {
            const itemExistente = prev.find(item => item.producto.id === producto.id);
            if (itemExistente) {
                return prev.map(item =>
                    item.producto.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prev, { producto, cantidad: 1 }];
        });
        setIsCartOpen(true);
    };

    const modificarCantidad = (productoId: number, delta: number) => {
        setCarrito(prev => prev.map(item => {
            if (item.producto.id === productoId) {
                const nuevaCantidad = item.cantidad + delta;
                return { ...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 0 };
            }
            return item;
        }).filter(item => item.cantidad > 0));
    };

    // Cálculos de precios
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const subtotal = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
    const tax = subtotal * 0.18; // IGV (18%)
    const total = subtotal + tax;

    // Filtrado de productos
    const productosFiltrados = categoriaActiva === 'ALL'
        ? productos
        : productos.filter(p => p.categoria.id === categoriaActiva);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando menú de la cafetería...</div>;

    return (
        <div className="catalogo-container">
            {/* HEADER */}
            <header className="top-nav">
                <div className="brand-logo">Coffee Fast</div>

                <nav className="nav-links hidden-mobile">
                    <a href="#" className="active">Menú</a>
                    <a href="#">Promociones</a>
                </nav>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="profile-menu-container">
                        <button
                            className="btn-filter"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '9999px' }}
                            onClick={handleProfileClick}
                        >
                            <span className="material-symbols-outlined">account_circle</span>
                            {usuarioLogueado && <span className="user-name-tag">{usuarioLogueado.nombre}</span>}
                        </button>

                        {isDropdownOpen && usuarioLogueado && (
                            <div className="profile-dropdown">
                                {usuarioLogueado.rol === 'ADMIN' && (
                                    <button
                                        className="profile-dropdown-btn"
                                        onClick={() => { navigate('/admin'); setIsDropdownOpen(false); }}
                                    >
                                        Panel Admin
                                    </button>
                                )}
                                <button
                                    className="profile-dropdown-btn"
                                    onClick={() => { navigate('/configuraciones'); setIsDropdownOpen(false); }}
                                >
                                    Configuraciones
                                </button>
                                <button
                                    className="profile-dropdown-btn logout"
                                    onClick={handleLogout}
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>

                    <button className="btn-primary" onClick={() => setIsCartOpen(true)}>
                        <span className="material-symbols-outlined">shopping_cart</span>
                        <span>{totalItems}</span>
                    </button>
                </div>
            </header>

            <main>
                {/* HERO */}
                <section className="hero-section">
                    <div>
                        <h1 className="hero-title">Premium Coffee.<br />Zero Wait.</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '18px', maxWidth: '400px', marginBottom: '24px' }}>
                            Elige tus favoritos y evita las colas. Preparado exacto cuando llegues.
                        </p>
                    </div>
                </section>

                <section className="main-content">
                    {/* FILTROS */}
                    <div className="filter-controls">
                        <button
                            className={`btn-filter ${categoriaActiva === 'ALL' ? 'active' : ''}`}
                            onClick={() => setCategoriaActiva('ALL')}
                        >
                            Todos
                        </button>
                        {categorias.map(cat => (
                            <button
                                key={cat.id}
                                className={`btn-filter ${categoriaActiva === cat.id ? 'active' : ''}`}
                                onClick={() => setCategoriaActiva(cat.id)}
                            >
                                {cat.nombre}
                            </button>
                        ))}
                    </div>

                    {/* GRILLA DE PRODUCTOS */}
                    <div className="products-grid">
                        {productosFiltrados.length === 0 ? (
                            <p>No hay productos disponibles en esta categoría.</p>
                        ) : (
                            productosFiltrados.map(producto => (
                                <article key={producto.id} className="product-card">
                                    <img
                                        src={producto.imagenUrl || 'https://via.placeholder.com/300x200?text=Cafeteria'}
                                        alt={producto.nombre}
                                        className="product-img"
                                    />
                                    <div className="product-info">
                                        <span className="product-category">{producto.categoria.nombre}</span>
                                        <h3 style={{ margin: '8px 0' }}>{producto.nombre}</h3>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                                            {producto.descripcion}
                                        </p>
                                        <div className="product-price-row">
                                            <span className="product-price">S/. {producto.precio.toFixed(2)}</span>
                                            <button
                                                className="btn-primary btn-icon"
                                                onClick={() => agregarAlCarrito(producto)}
                                            >
                                                <span className="material-symbols-outlined">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {/* OVERLAY CARRITO */}
            {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>}

            {/* DRAWER CARRITO */}
            <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>Tu Orden</h2>
                    <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="drawer-body">
                    {carrito.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '40px' }}>
                            Tu carrito está vacío.
                        </p>
                    ) : (
                        carrito.map(item => (
                            <div key={item.producto.id} className="cart-item">
                                <div>
                                    <div className="cart-item-title">{item.producto.nombre}</div>
                                    <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                                        S/. {item.producto.precio.toFixed(2)} c/u
                                    </div>
                                </div>
                                <div className="cart-controls">
                                    <button className="btn-small" onClick={() => modificarCantidad(item.producto.id, -1)}>-</button>
                                    <span style={{ fontWeight: 'bold' }}>{item.cantidad}</span>
                                    <button className="btn-small" onClick={() => modificarCantidad(item.producto.id, 1)}>+</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {carrito.length > 0 && (
                    <div className="drawer-footer">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--color-text-muted)' }}>
                            <span>Subtotal</span><span>S/. {subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--color-text-muted)' }}>
                            <span>IGV (18%)</span><span>S/. {tax.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '20px', marginBottom: '20px', color: 'var(--color-primary)' }}>
                            <span>Total</span><span>S/. {total.toFixed(2)}</span>
                        </div>
                        <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
                            <span className="material-symbols-outlined">lock</span> Confirmar Pedido
                        </button>
                    </div>
                )}
            </aside>
        </div>
    );
}
