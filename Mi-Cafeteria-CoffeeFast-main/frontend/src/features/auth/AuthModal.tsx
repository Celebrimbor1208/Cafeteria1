/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { authService } from './services/authService';
import './auth.css';

interface AuthModalProps {
    onClose: () => void;
    }

    export default function AuthModal({ onClose }: AuthModalProps) {
    const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    
    // Estados para feedback visual
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Manejo de Inicio de Sesión
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);
        try {
        await authService.login(email, password);
        alert('¡Inicio de sesión exitoso!');
        onClose(); // Cierra el modal automáticamente
        window.location.reload(); // Recarga rápido para actualizar estados globales si los hay
        } catch (error: any) {
        setErrorMessage(error.message || 'Credenciales inválidas');
        } finally {
        setLoading(false);
        }
    };

    // Manejo de Registro
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);
        try {
        await authService.registrar(email, password, nombre);
        alert('¡Registro exitoso! Por favor revisa tu correo si tienes la confirmación activa.');
        setIsLoginMode(true); // Lo manda a iniciar sesión
        } catch (error: any) {
        setErrorMessage(error.message || 'Error al crear la cuenta');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="auth-card">
            <button className="close-modal-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
            </button>

            <div className="auth-image-panel">
            <div className="auth-image-bg"></div>
            <div className="auth-image-overlay"></div>
            <div className="auth-image-content">
                <h1 className="auth-image-title">Coffee Fast</h1>
                <p style={{ color: '#ffdcbd', fontSize: '18px' }}>Velocidad sin comprometer la calidad.</p>
            </div>
            </div>

            <div className="auth-form-panel" style={{ overflowY: 'auto' }}>
            <h1 className="auth-mobile-logo">Coffee Fast</h1>

            <div className="auth-tabs">
                <button 
                className={`auth-tab ${isLoginMode ? 'active' : ''}`}
                onClick={() => { setIsLoginMode(true); setErrorMessage(null); }}
                >
                Iniciar Sesión
                </button>
                <button 
                className={`auth-tab ${!isLoginMode ? 'active' : ''}`}
                onClick={() => { setIsLoginMode(false); setErrorMessage(null); }}
                >
                Registrarse
                </button>
            </div>

            {/* Muestra mensajes de error de Supabase si existen */}
            {errorMessage && (
                <div style={{ color: 'var(--color-error)', backgroundColor: '#ffdad6', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '15px', fontWeight: 'bold' }}>
                ⚠️ {errorMessage}
                </div>
            )}

            {isLoginMode ? (
                <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label className="form-label">Correo</label>
                    <input 
                    type="email" 
                    className="custom-input" 
                    placeholder="tu@correo.com" 
                    required 
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                <div className="form-group">
                    <div className="form-label-row">
                    <label className="form-label" style={{ margin: 0 }}>Contraseña</label>
                    <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                    </div>
                    <input 
                    type="password" 
                    className="custom-input" 
                    placeholder="••••••••" 
                    required 
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Cargando...' : 'Entrar'} <span className="material-symbols-outlined">login</span>
                </button>
                </form>
            ) : (
                <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label className="form-label">Nombre Completo</label>
                    <input 
                    type="text" 
                    className="custom-input" 
                    placeholder="Juan Pérez" 
                    required 
                    disabled={loading}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Correo</label>
                    <input 
                    type="email" 
                    className="custom-input" 
                    placeholder="tu@correo.com" 
                    required 
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                <div className="form-group">
                    <label className="form-label">Contraseña</label>
                    <input 
                    type="password" 
                    className="custom-input" 
                    placeholder="••••••••" 
                    required 
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Registrando...' : 'Crear Cuenta'} <span className="material-symbols-outlined">person_add</span>
                </button>
                </form>
            )}
            </div>
        </div>
        </div>
    );
}