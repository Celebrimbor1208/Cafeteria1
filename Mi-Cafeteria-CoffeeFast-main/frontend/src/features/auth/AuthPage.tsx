import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';
import { authService } from "./services/authService";

export default function AuthPage() {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);

        try {
            const respuesta = await authService.login(email, password);

            if (!respuesta?.session) {
                throw new Error("No se pudo iniciar sesión");
            }

            const rol = localStorage.getItem('user_role') || 'CLIENTE';

            if (rol === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error: any) {
            setErrorMessage(error.message || 'Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);

        try {
            await authService.registrar(email, password, nombre);
            alert('¡Registro exitoso! Por favor revisa tu correo si tienes la confirmación activa.');
            setIsLoginMode(true);
            setPassword('');
        } catch (error: any) {
            setErrorMessage(error.message || 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-image-panel">
                    <div className="auth-image-bg"></div>
                    <div className="auth-image-overlay"></div>
                    <div className="auth-image-content">
                        <h1 className="auth-image-title">Coffee Fast</h1>
                        <p style={{ color: '#ffdcbd', fontSize: '18px' }}>
                            Velocidad sin comprometer la calidad.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            position: 'absolute', top: 16, left: 16, zIndex: 20,
                            background: 'rgba(255,255,255,0.15)', border: 'none',
                            color: 'white', padding: '8px 14px', borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        ← Volver al catálogo
                    </button>
                </div>

                <div className="auth-form-panel">
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

                    {errorMessage && (
                        <div style={{
                            color: '#b3261e', backgroundColor: '#ffdad6', padding: '10px',
                            borderRadius: '8px', fontSize: '14px', marginBottom: '15px', fontWeight: 'bold'
                        }}>
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
                                {loading ? 'Cargando...' : 'Entrar'}
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
                                {loading ? 'Registrando...' : 'Crear Cuenta'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}