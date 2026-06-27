import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

export default function AuthPage() {
    const navigate = useNavigate();
    // Estado para alternar entre Login y Registro
    const [isLoginMode, setIsLoginMode] = useState<boolean>(true);

    // Estados para capturar los datos de los formularios
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');

    // Función para manejar el envío del Login
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Intentando iniciar sesión con:', { email, password });
        // Aquí llamarás a tu authService para Supabase/Spring Boot
    };

    // Función para manejar el envío del Registro
    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Intentando registrar usuario:', { nombre, email, password });
        // Aquí llamarás a tu authService
    };

    return (
        <div className="auth-container">
        <div className="auth-card">
            
            
            {/* Panel Izquierdo: Imagen de Branding (Solo Desktop) */}
            <div className="auth-image-panel">
            <div className="auth-image-bg"></div>
            <div className="auth-image-overlay"></div>
            <div className="auth-image-content">
                <button 
                    onClick={() => navigate('/catalogo')}
                    style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                    Volver al catálogo
                </button>
                <h1 className="auth-image-title">Coffee Fast</h1>
                <p style={{ color: '#ffdcbd', fontSize: '18px' }}>Velocidad sin comprometer la calidad.</p>
            </div>
            </div>

            

            {/* Panel Derecho: Formularios */}
            <div className="auth-form-panel">
            
            {/* Logo para Móviles */}
            <h1 className="auth-mobile-logo">Coffee Fast</h1>

            {/* Pestañas de Navegación */}
            <div className="auth-tabs">
                <button 
                className={`auth-tab ${isLoginMode ? 'active' : ''}`}
                onClick={() => setIsLoginMode(true)}
                >
                Iniciar Sesión
                </button>
                <button 
                className={`auth-tab ${!isLoginMode ? 'active' : ''}`}
                onClick={() => setIsLoginMode(false)}
                >
                Registrarse
                </button>
            </div>

            {/* Renderizado Condicional de los Formularios */}
            {isLoginMode ? (
                
                /* --- FORMULARIO DE LOGIN --- */
                <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label className="form-label" htmlFor="login-email">Correo</label>
                    <input 
                    id="login-email" 
                    type="email" 
                    className="custom-input" 
                    placeholder="tu@correo.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                <div className="form-group">
                    <div className="form-label-row">
                    <label className="form-label" htmlFor="login-password" style={{ margin: 0 }}>Contraseña</label>
                    <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                    </div>
                    <input 
                    id="login-password" 
                    type="password" 
                    className="custom-input" 
                    placeholder="••••••••" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <button type="submit" className="btn-submit">
                    Entrar <span className="material-symbols-outlined">login</span>
                </button>
                </form>

            ) : (

                /* --- FORMULARIO DE REGISTRO --- */
                <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label className="form-label" htmlFor="reg-name">Nombre Completo</label>
                    <input 
                    id="reg-name" 
                    type="text" 
                    className="custom-input" 
                    placeholder="Juan Pérez" 
                    required 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="reg-email">Correo</label>
                    <input 
                    id="reg-email" 
                    type="email" 
                    className="custom-input" 
                    placeholder="tu@correo.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                <div className="form-group">
                    <label className="form-label" htmlFor="reg-password">Contraseña</label>
                    <input 
                    id="reg-password" 
                    type="password" 
                    className="custom-input" 
                    placeholder="••••••••" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <button type="submit" className="btn-submit">
                    Crear Cuenta <span className="material-symbols-outlined">person_add</span>
                </button>
                </form>

            )}

            </div>
        </div>
        </div>
    );
}