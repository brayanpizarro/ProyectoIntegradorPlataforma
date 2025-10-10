import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entrevista } from './schemas/entrevista.schema';
import { CreateEntrevistaDto } from './dto/create-entrevista.dto';
import { UpdateEntrevistaDto } from './dto/update-entrevista.dto';
import {
  EtiquetaInput,
  Etiqueta,
  AcuerdoPendiente,
  TemaRecurrente,
  HistorialEtiqueta,
  EstadisticasEstudiante,
  AgregarEtiquetaData,
  EtiquetaAcumulada,
  PrepararEntrevistaResponse,
  EntrevistaFilters,
} from './interfaces/entrevista.interface';

@Injectable()
export class EntrevistasService {
  constructor(
    @InjectModel(Entrevista.name) private entrevistaModel: Model<Entrevista>,
  ) {}

  // MÉTODO PARA CREAR ENTREVISTA CON ETIQUETAS ACUMULATIVAS
  async create(createEntrevistaDto: CreateEntrevistaDto): Promise<Entrevista> {
    // 1. Verificar que no existe ya esta entrevista
    const idEntrevista = `${createEntrevistaDto.año}-${createEntrevistaDto.id_estudiante}-${createEntrevistaDto.numero_entrevista}`;

    const existe = await this.entrevistaModel
      .findOne({ id_entrevista: idEntrevista })
      .exec();
    if (existe) {
      throw new BadRequestException(`Ya existe la entrevista ${idEntrevista}`);
    }

    // 2. Obtener entrevistas anteriores para acumular etiquetas
    const entrevistasAnteriores = await this.entrevistaModel
      .find({
        estudianteId: createEntrevistaDto.id_estudiante,
        año: createEntrevistaDto.año,
      })
      .exec();

    // 3. Convertir fecha de string a Date
    const fechaEntrevista = new Date(createEntrevistaDto.fecha);

    // 4. Procesar etiquetas acumulativas
    const etiquetasProcesadas = this.procesarEtiquetasAcumulativas(
      entrevistasAnteriores,
      createEntrevistaDto.etiquetas,
      fechaEntrevista,
    );

    // 5. Crear la nueva entrevista
    const entrevistaData = {
      ...createEntrevistaDto,
      id_entrevista: idEntrevista,
      fecha: fechaEntrevista,
      etiquetas: etiquetasProcesadas,
    };

    const createdEntrevista = new this.entrevistaModel(entrevistaData);
    return await createdEntrevista.save();
  }

  // MÉTODO PARA ACTUALIZAR ENTREVISTA
  async update(
    id: string,
    updateEntrevistaDto: UpdateEntrevistaDto,
  ): Promise<Entrevista> {
    const existingEntrevista = await this.entrevistaModel
      .findOne({ _id: id })
      .exec();

    if (!existingEntrevista) {
      throw new NotFoundException(`Entrevista con ID ${id} no encontrada`);
    }

    // Obtener entrevistas anteriores (excluyendo la actual) para recalcular acumulativos
    const otrasEntrevistas = await this.entrevistaModel
      .find({
        estudianteId: existingEntrevista.estudianteId,
        año: existingEntrevista.año,
        _id: { $ne: id }, // Excluir la entrevista actual
      })
      .exec();

    // Extraer campos del DTO de forma segura
    const {
      fecha,
      nombre_tutor,
      año,
      numero_entrevista,
      duracion_minutos,
      tipo_entrevista,
      estado,
      observaciones,
      temas_abordados,
      etiquetas,
    } = updateEntrevistaDto;

    // Construir objeto updateData con tipos seguros
    const updateData: Partial<Entrevista> = {};

    // Procesar campos individualmente
    if (fecha) updateData.fecha = new Date(fecha);
    if (nombre_tutor) updateData.nombre_Tutor = nombre_tutor;
    if (año) updateData.año = año;
    if (numero_entrevista) updateData.numero_Entrevista = numero_entrevista;
    if (duracion_minutos) updateData.duracion_minutos = duracion_minutos;
    if (tipo_entrevista) updateData.tipo_entrevista = tipo_entrevista;
    if (estado) updateData.estado = estado;
    if (observaciones) updateData.observaciones = observaciones;
    if (temas_abordados) updateData.temas_abordados = temas_abordados;

    // Procesar etiquetas acumulativas si vienen en el update
    if (etiquetas) {
      const fechaParaEtiquetas = fecha
        ? new Date(fecha)
        : existingEntrevista.fecha;

      // Filtrar solo etiquetas con nombre_etiqueta definido
      const etiquetasValidas = etiquetas.filter(
        (etiqueta) =>
          etiqueta.nombre_etiqueta && etiqueta.nombre_etiqueta.trim() !== '',
      ) as EtiquetaInput[];

      updateData.etiquetas = this.procesarEtiquetasAcumulativas(
        otrasEntrevistas,
        etiquetasValidas,
        fechaParaEtiquetas,
      );
    }

    const entrevistaActualizada = await this.entrevistaModel
      .findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true })
      .exec();

    if (!entrevistaActualizada) {
      throw new NotFoundException(
        `Entrevista con ID ${id} no se pudo actualizar`,
      );
    }
    return entrevistaActualizada;
  }

  // MÉTODO PARA PROCESAR ETIQUETAS ACUMULATIVAS
  private procesarEtiquetasAcumulativas(
    entrevistasAnteriores: Entrevista[],
    nuevasEtiquetas: EtiquetaInput[],
    fechaEntrevista: Date,
  ): Etiqueta[] {
    const etiquetasHistoricas = new Map<string, Etiqueta>();

    entrevistasAnteriores.forEach((entrevista) => {
      entrevista.etiquetas.forEach((etiquetaObj) => {
        if (!etiquetasHistoricas.has(etiquetaObj.nombre_etiqueta)) {
          const primerTexto =
            etiquetaObj.textos.length > 0 ? etiquetaObj.textos[0] : null;
          const fechaPorDefecto = primerTexto
            ? new Date(primerTexto.fecha)
            : fechaEntrevista;

          etiquetasHistoricas.set(etiquetaObj.nombre_etiqueta, {
            nombre_etiqueta: etiquetaObj.nombre_etiqueta,
            textos: etiquetaObj.textos.map((texto) => ({
              contenido: texto.contenido,
              fecha: new Date(texto.fecha),
              contexto: texto.contexto,
            })),
            primera_vez: etiquetaObj.primera_vez
              ? new Date(etiquetaObj.primera_vez)
              : fechaPorDefecto,
            ultima_vez: etiquetaObj.ultima_vez
              ? new Date(etiquetaObj.ultima_vez)
              : fechaPorDefecto,
            frecuencia: etiquetaObj.frecuencia,
          });
        }
      });
    });

    return nuevasEtiquetas.map((nuevaEtiqueta) => {
      const etiquetaExistente = etiquetasHistoricas.get(
        nuevaEtiqueta.nombre_etiqueta,
      );

      if (etiquetaExistente) {
        return {
          nombre_etiqueta: nuevaEtiqueta.nombre_etiqueta,
          textos: [
            ...etiquetaExistente.textos,
            ...(nuevaEtiqueta.textos || []).map((texto) => ({
              contenido: texto.contenido,
              fecha: new Date(texto.fecha),
              contexto: texto.contexto || '',
            })),
          ],
          primera_vez: etiquetaExistente.primera_vez,
          ultima_vez: fechaEntrevista,
          frecuencia: etiquetaExistente.frecuencia + 1,
        };
      } else {
        return {
          nombre_etiqueta: nuevaEtiqueta.nombre_etiqueta,
          textos: (nuevaEtiqueta.textos || []).map((texto) => ({
            contenido: texto.contenido,
            fecha: new Date(texto.fecha),
            contexto: texto.contexto || '',
          })),
          primera_vez: fechaEntrevista,
          ultima_vez: fechaEntrevista,
          frecuencia: 1,
        };
      }
    });
  }

  // MÉTODO PARA PREPARAR NUEVA ENTREVISTA
  async prepararNuevaEntrevista(
    idEstudiante: number,
    año: number,
  ): Promise<PrepararEntrevistaResponse> {
    const entrevistasAnteriores = await this.entrevistaModel
      .find({
        estudianteId: idEstudiante,
        año: año,
      })
      .sort({ numero_Entrevista: 1 })
      .exec();

    const proximaEntrevista = entrevistasAnteriores.length + 1;

    // Extraer etiquetas acumuladas
    const todasEtiquetas = new Map<string, EtiquetaAcumulada>();
    entrevistasAnteriores.forEach((entrevista) => {
      entrevista.etiquetas.forEach((etiqueta) => {
        if (!todasEtiquetas.has(etiqueta.nombre_etiqueta)) {
          todasEtiquetas.set(etiqueta.nombre_etiqueta, {
            nombre: etiqueta.nombre_etiqueta,
            frecuencia: etiqueta.frecuencia,
            primera_vez: etiqueta.primera_vez || new Date(),
            ultima_vez: etiqueta.ultima_vez || new Date(),
            textos_recientes: etiqueta.textos
              .sort(
                (a, b) =>
                  new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
              )
              .slice(0, 3),
          });
        }
      });
    });

    const acuerdosPendientes = this.obtenerAcuerdosPendientes(
      entrevistasAnteriores,
    );

    return {
      estudiante: idEstudiante,
      año: año,
      numero_proxima_entrevista: proximaEntrevista,
      total_entrevistas_previas: entrevistasAnteriores.length,
      etiquetas_acumuladas: Array.from(todasEtiquetas.values()),
      acuerdos_pendientes: acuerdosPendientes,
      temas_recurrentes: this.identificarTemasRecurrentes(
        entrevistasAnteriores,
      ),
    };
  }

  // MÉTODO AUXILIAR: Obtener acuerdos pendientes
  private obtenerAcuerdosPendientes(
    entrevistas: Entrevista[],
  ): AcuerdoPendiente[] {
    const acuerdosPendientes: AcuerdoPendiente[] = [];

    entrevistas.forEach((entrevista) => {
      const acuerdosRegex = /acuerdo:?\s*(.*?)(?=\.|$)/gi;
      const matches = entrevista.observaciones?.match(acuerdosRegex) || [];

      matches.forEach((match) => {
        acuerdosPendientes.push({
          acuerdo: match.replace(/acuerdo:?\s*/i, '').trim(),
          entrevista_origen: entrevista.numero_Entrevista,
          fecha_origen: new Date(entrevista.fecha),
          tutor: entrevista.nombre_Tutor,
        });
      });
    });

    return acuerdosPendientes.slice(0, 5);
  }

  // MÉTODO AUXILIAR: Identificar temas recurrentes
  private identificarTemasRecurrentes(
    entrevistas: Entrevista[],
  ): TemaRecurrente[] {
    const temasFrecuencia = new Map<string, number>();

    entrevistas.forEach((entrevista) => {
      entrevista.temas_abordados?.forEach((tema) => {
        const frecuenciaActual = temasFrecuencia.get(tema) || 0;
        temasFrecuencia.set(tema, frecuenciaActual + 1);
      });

      entrevista.etiquetas.forEach((etiqueta) => {
        const frecuenciaActual =
          temasFrecuencia.get(etiqueta.nombre_etiqueta) || 0;
        temasFrecuencia.set(
          etiqueta.nombre_etiqueta,
          frecuenciaActual + etiqueta.frecuencia,
        );
      });
    });

    return Array.from(temasFrecuencia.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tema, frecuencia]) => ({ tema, frecuencia }));
  }

  // MÉTODOS CRUD BÁSICOS
  async findAll(
    filters: EntrevistaFilters = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 10 },
  ): Promise<{
    data: Entrevista[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Crear filtros seguros para MongoDB
    const mongoFilters: Record<string, any> = {};

    // Mapear filtros de forma segura
    if (filters.estudianteId) {
      mongoFilters.estudianteId = filters.estudianteId;
    }
    if (filters.año) {
      mongoFilters.año = filters.año;
    }
    if (filters.tipo_entrevista) {
      mongoFilters.tipo_entrevista = filters.tipo_entrevista;
    }
    if (filters.estado) {
      mongoFilters.estado = filters.estado;
    }

    const query = this.entrevistaModel.find(mongoFilters);

    const [data, total] = await Promise.all([
      query.sort({ fecha: -1 }).skip(skip).limit(limit).exec(),
      this.entrevistaModel.countDocuments(mongoFilters).exec(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Entrevista> {
    const entrevista = await this.entrevistaModel
      .findOne({ id_entrevista: id })
      .exec();
    if (!entrevista) {
      throw new NotFoundException(`Entrevista con ID ${id} no encontrada`);
    }
    return entrevista;
  }

  async findByEstudiante(idEstudiante: number): Promise<Entrevista[]> {
    return await this.entrevistaModel
      .find({ estudianteId: idEstudiante })
      .sort({ fecha: -1 })
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.entrevistaModel
      .deleteOne({ id_entrevista: id })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Entrevista con ID ${id} no encontrada`);
    }
  }

  // MÉTODOS ESPECÍFICOS PARA ETIQUETAS
  async agregarEtiqueta(
    id: string,
    etiquetaData: AgregarEtiquetaData,
  ): Promise<Entrevista> {
    const entrevista = await this.entrevistaModel.findOne({ _id: id }).exec();

    if (!entrevista) {
      throw new NotFoundException(`Entrevista con ID ${id} no encontrada`);
    }

    // Buscar si la etiqueta ya existe
    const etiquetaExistente = entrevista.etiquetas.find(
      (e) => e.nombre_etiqueta === etiquetaData.nombre_etiqueta,
    );

    const nuevoTexto = {
      contenido: etiquetaData.contenido,
      fecha: new Date(),
      contexto: etiquetaData.contexto || '',
    };

    if (etiquetaExistente) {
      // Actualizar etiqueta existente
      etiquetaExistente.textos.push(nuevoTexto);
      etiquetaExistente.ultima_vez = new Date();
      etiquetaExistente.frecuencia += 1;
    } else {
      // Crear nueva etiqueta
      entrevista.etiquetas.push({
        nombre_etiqueta: etiquetaData.nombre_etiqueta,
        textos: [nuevoTexto],
        primera_vez: new Date(),
        ultima_vez: new Date(),
        frecuencia: 1,
      });
    }

    return await entrevista.save();
  }

  async getHistorialEtiqueta(
    idEstudiante: number,
    etiqueta: string,
  ): Promise<HistorialEtiqueta> {
    const entrevistas = await this.entrevistaModel
      .find({ estudianteId: idEstudiante })
      .sort({ fecha: 1 })
      .exec();

    const aparicionesEtiqueta: {
      fecha: Date;
      numero_entrevista: number;
      contenido: string;
      contexto?: string;
    }[] = [];

    let primeraVez: Date | null = null;
    let ultimaVez: Date | null = null;
    let totalApariciones = 0;

    entrevistas.forEach((entrevista) => {
      const etiquetaEncontrada = entrevista.etiquetas.find(
        (e) => e.nombre_etiqueta.toLowerCase() === etiqueta.toLowerCase(),
      );

      if (etiquetaEncontrada) {
        etiquetaEncontrada.textos.forEach((texto) => {
          aparicionesEtiqueta.push({
            fecha: new Date(texto.fecha),
            numero_entrevista: entrevista.numero_Entrevista,
            contenido: texto.contenido,
            contexto: texto.contexto,
          });

          totalApariciones++;

          const fechaTexto = new Date(texto.fecha);
          if (!primeraVez || fechaTexto < primeraVez) {
            primeraVez = fechaTexto;
          }
          if (!ultimaVez || fechaTexto > ultimaVez) {
            ultimaVez = fechaTexto;
          }
        });
      }
    });

    if (totalApariciones === 0) {
      throw new NotFoundException(
        `No se encontró la etiqueta "${etiqueta}" para el estudiante ${idEstudiante}`,
      );
    }

    aparicionesEtiqueta.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

    const historial: HistorialEtiqueta = {
      etiqueta,
      estudianteId: idEstudiante,
      total_apariciones: totalApariciones,
      primera_vez: primeraVez!,
      ultima_vez: ultimaVez!,
      entrevistas: aparicionesEtiqueta,
    };

    return historial;
  }

  async getEstadisticasEstudiante(
    idEstudiante: number,
  ): Promise<EstadisticasEstudiante> {
    const entrevistas = await this.entrevistaModel
      .find({ estudianteId: idEstudiante })
      .exec();

    if (entrevistas.length === 0) {
      throw new NotFoundException(
        `No se encontraron entrevistas para el estudiante ${idEstudiante}`,
      );
    }

    // Calcular estadísticas por año
    const entrevistasPorAño = new Map<number, number>();
    const etiquetasFrecuencia = new Map<string, number>();
    let duracionTotal = 0;

    entrevistas.forEach((entrevista) => {
      // Conteo por año
      const año = entrevista.año;
      entrevistasPorAño.set(año, (entrevistasPorAño.get(año) || 0) + 1);

      // Sumar duración
      duracionTotal += entrevista.duracion_minutos || 0;

      // Conteo de etiquetas
      entrevista.etiquetas.forEach((etiqueta) => {
        etiquetasFrecuencia.set(
          etiqueta.nombre_etiqueta,
          (etiquetasFrecuencia.get(etiqueta.nombre_etiqueta) || 0) +
            etiqueta.frecuencia,
        );
      });
    });

    // Ordenar etiquetas por frecuencia
    const etiquetasMasComunes = Array.from(etiquetasFrecuencia.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([etiqueta, frecuencia]) => ({ etiqueta, frecuencia }));

    // Encontrar última entrevista
    const ultimaEntrevista = entrevistas.sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    )[0].fecha;

    const estadisticas: EstadisticasEstudiante = {
      total_entrevistas: entrevistas.length,
      entrevistas_por_año: Array.from(entrevistasPorAño.entries()).map(
        ([año, count]) => ({
          año,
          count,
        }),
      ),
      etiquetas_mas_comunes: etiquetasMasComunes,
      duracion_promedio: Math.round(duracionTotal / entrevistas.length),
      ultima_entrevista: new Date(ultimaEntrevista),
    };

    return estadisticas;
  }
}
