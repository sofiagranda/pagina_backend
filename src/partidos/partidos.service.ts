import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Partido } from './partidos.entity';
import { EstadoPartido } from './partidos.entity'; // nuevo
import { CreatePartidoDto } from './dto/create-partidos.dto';
import { UpdatePartidoDto } from './dto/update-partidos.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vocalia, VocaliaDocument } from '../vocalias/schemas/vocalias.schema';

import { VocaliasService } from 'src/vocalias/vocalias.service';
import { EstadisticasService } from 'src/estadisticas/estadisticas.service';
import { TablaPosicionesService } from 'src/tablaPosiciones/tabla-posiciones.service';

@Injectable()
export class PartidosService {
  constructor(
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,

    @InjectModel(Vocalia.name)
    private readonly vocaliaModel: Model<VocaliaDocument>,

    private readonly vocaliasService: VocaliasService,
    private readonly estadisticasService: EstadisticasService,
    private readonly tablaPosicionesService: TablaPosicionesService,
  ) { }

  async create(createPartidoDto: CreatePartidoDto): Promise<Partido> {
    const {
      equipoLocalId,
      equipoVisitanteId,
      fecha,
      golesLocal = 0,
      golesVisitante = 0,
      estado = EstadoPartido.PENDIENTE,
    } = createPartidoDto;

    if (equipoLocalId === equipoVisitanteId) {
      throw new BadRequestException('El equipo local y visitante no pueden ser el mismo');
    }

    const partido = this.partidoRepository.create({
      equipoLocalId,
      equipoVisitanteId,
      fecha: new Date(fecha),
      golesLocal,
      golesVisitante,
      estado,
    });

    const savedPartido = await this.partidoRepository.save(partido);

    // Crear vocalía asociada
    await this.vocaliasService.createVocaliaDesdePartido(savedPartido);

    return savedPartido;
  }

  async findAll(): Promise<Partido[]> {
    return this.partidoRepository.find();
  }

  async findOne(id: number): Promise<Partido> {
    const partido = await this.partidoRepository.findOne({ where: { id } });
    if (!partido) throw new NotFoundException(`Partido con id ${id} no encontrado`);
    return partido;
  }

  async update(id: number, updatePartidoDto: UpdatePartidoDto): Promise<Partido> {
    const partido = await this.findOne(id);

    if (
      updatePartidoDto.equipoLocalId &&
      updatePartidoDto.equipoVisitanteId &&
      updatePartidoDto.equipoLocalId === updatePartidoDto.equipoVisitanteId
    ) {
      throw new BadRequestException('El equipo local y visitante no pueden ser el mismo');
    }

    const golesLocalAntes = partido.golesLocal;
    const golesVisitanteAntes = partido.golesVisitante;
    const estadoAnterior = partido.estado;

    if (updatePartidoDto.golesLocal !== undefined) partido.golesLocal = updatePartidoDto.golesLocal;
    if (updatePartidoDto.golesVisitante !== undefined) partido.golesVisitante = updatePartidoDto.golesVisitante;
    if (updatePartidoDto.fecha) partido.fecha = new Date(updatePartidoDto.fecha);
    if (updatePartidoDto.estado) partido.estado = updatePartidoDto.estado;

    if (updatePartidoDto.fecha) {
      partido.fecha = new Date(updatePartidoDto.fecha);
    }

    const updatedPartido = await this.partidoRepository.save(partido);

    // 🔁 Recargar partido completo con campos necesarios (por seguridad)
    const partidoCompleto = await this.partidoRepository.findOne({
      where: { id: updatedPartido.id },
      select: [
        'id',
        'equipoLocalId',
        'equipoVisitanteId',
        'golesLocal',
        'golesVisitante',
        'estado',
      ],
    });

    if (!partidoCompleto) {
      throw new NotFoundException('No se pudo cargar el partido actualizado completo');
    }

    console.log('▶ Ajustando goles de partido:', partidoCompleto.id);
    console.log('➡ Local ID:', partidoCompleto.equipoLocalId, '| Visitante ID:', partidoCompleto.equipoVisitanteId);
    console.log('➡ Goles actuales:', partidoCompleto.golesLocal, '-', partidoCompleto.golesVisitante);
    console.log('➡ Goles anteriores:', golesLocalAntes, '-', golesVisitanteAntes);

    const golesCambiaron =
      golesLocalAntes !== partidoCompleto.golesLocal ||
      golesVisitanteAntes !== partidoCompleto.golesVisitante;

    console.log("🧪 Estado antes:", estadoAnterior);

    if (golesCambiaron) {
      await this.vocaliasService.updateVocaliaScore(partidoCompleto);
      await this.estadisticasService.adjustGoles(partidoCompleto, {
        golesLocal: golesLocalAntes,
        golesVisitante: golesVisitanteAntes,
      });
      await this.tablaPosicionesService.adjustGoles(partidoCompleto, {
        golesLocal: golesLocalAntes,
        golesVisitante: golesVisitanteAntes,
      });
    }
    const estadoCompletoNuevo = partidoCompleto.estado === EstadoPartido.COMPLETO;
    console.log("🧪 Estado después:", partidoCompleto.estado);
    const estadoCompletoAntes = estadoAnterior === EstadoPartido.COMPLETO;

    if (!estadoCompletoAntes && estadoCompletoNuevo) {
      console.log("✔ Llamando a markPlayed porque cambió de pendiente a completo");
      await this.tablaPosicionesService.markPlayed(partidoCompleto);
    }


    return updatedPartido;
  }


  async remove(id: number): Promise<void> {
    const partido = await this.findOne(id);
    await this.partidoRepository.remove(partido);
  }

  async sincronizarVocalias(): Promise<void> {
    const partidos = await this.partidoRepository.find();

    for (const partido of partidos) {
      const existeVocalia = await this.vocaliaModel.findOne({ partidoId: partido.id }).exec();

      if (!existeVocalia) {
        await this.vocaliasService.createVocaliaDesdePartido(partido);
        console.log(`✔ Vocalía creada para partido ${partido.id}`);
      } else {
        console.log(`⏩ Vocalía ya existente para partido ${partido.id}`);
      }
    }

    console.log('🎯 Sincronización completada.');
  }
}
