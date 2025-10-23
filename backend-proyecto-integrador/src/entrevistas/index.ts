// Controllers
export { EntrevistasController } from './entrevistas.controller';

// Services
export { EntrevistasService } from './entrevistas.service';

// Module
export { EntrevistasModule } from './entrevistas.module';

// Schemas
export type { Entrevista } from './schemas/entrevista.schema';

// DTOs
export type { CreateEntrevistaDto } from './dto/create-entrevista.dto';
export type { UpdateEntrevistaDto } from './dto/update-entrevista.dto';

// Interfaces (exportar las específicas que existen)
export type { TextoEtiquetaInput, TextoEtiqueta } from './interfaces/entrevista.interface';
