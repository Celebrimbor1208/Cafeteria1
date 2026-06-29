export type Rol = 'CLIENTE' | 'EMPLEADO' | 'ADMIN';

export type EstadoPedido = 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';


export interface Perfil {
    id: string; // UUID en Java -> string en TS
    nombre: string;
    correo: string;
    telefono: string | null;
    rol: Rol;
    isDeleted: boolean;
}

export interface Categoria {
    id: number;       
    nombre: string;   
    isDeleted: boolean;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    categoria: Categoria; 
    disponible: boolean;
    isDeleted: boolean;
    imagenUrl: string | null;
}

export interface ItemCarrito {
    id?: number;
    producto: Producto;
    cantidad: number;
}

export interface Carrito {
    id: number;
    perfil: Perfil;
    items: ItemCarrito[];
    fechaModificacion: string; 
}

export interface DetallePedido {
    id?: number;
    producto: Producto;
    cantidad: number;
    precioUnitario: number;
}

export interface Pedido {
    id: number;
    perfil: Perfil;
    items: DetallePedido[];
    montoTotal: number;
    estado: EstadoPedido;
    fechaCreacion: string;
    indicacionesEspeciales: string | null;
}