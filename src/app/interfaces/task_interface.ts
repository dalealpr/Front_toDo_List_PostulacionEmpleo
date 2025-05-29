export interface Task {
  id: number;            
  titulo: string;
  descripcion?: string;  
  status: 'pendiente' | 'completada' | 'en progreso';  
  fechaCreacion?: string;  
  fechaActualizacion?: string;
}