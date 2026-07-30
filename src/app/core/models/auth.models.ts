// Petición y Respuesta de Login
export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  requiereOtp: boolean;
  usuarioId: number;
  mensaje: string;
}

// Petición y Respuesta de Validación de Código (2FA)
export interface ValidarOtpRequest {
  usuarioId: number;
  codigo: string;
}

export interface ValidarOtpResponse {
  autenticado: boolean;
  usuarioId: number;
  token: string;
  mensaje: string;
}

export interface MeResponse {
  usuarioId: number;
  nombreCompleto: string;
  correo: string;
  perfil: {
    perfilId: number;
    nombre: string;
    tipo: string;
  };
  permisos: any[];
}

export interface CambiarPasswordPropioRequest {
  passwordActual: string;
  passwordNuevo: string;
}
