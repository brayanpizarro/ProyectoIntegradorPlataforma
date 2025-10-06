// Exportación centralizada de todos los servicios
export { authService } from './authService';
export { estudianteService } from './estudianteService';
export { academicoService } from './academicoService';
export { institucionService } from './institucionService';
export { reporteService } from './reporteService';

// Reexportar servicios por defecto
export { default as authServiceDefault } from './authService';
export { default as estudianteServiceDefault } from './estudianteService';
export { default as academicoServiceDefault } from './academicoService';
export { default as institucionServiceDefault } from './institucionService';
export { default as reporteServiceDefault } from './reporteService';