import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Partido } from './partidos.entity';
import { Estadistica } from 'src/estadisticas/estadisticas.entity';
import { CreatePartidoDto } from './dto/create-partidos.dto';
import { UpdatePartidoDto } from './dto/update-partidos.dto';

@Injectable()
export class PartidosService {
  constructor(
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,

    @InjectRepository(Estadistica)
    private readonly estadisticaRepository: Repository<Estadistica>,
  ) {}

  async create(createPartidoDto: CreatePartidoDto): Promise<Partido> {
    const {
      equipoLocalId,
      equipoVisitanteId,
      fecha,
      golesLocal = 0,
      golesVisitante = 0,
      estado = 'pendiente',
    } = createPartidoDto;

    if (equipoLocalId === equipoVisitanteId) {
      throw new BadRequestException('El equipo local y visitante no pueden ser el mismo');
    }

    const partido = this.partidoRepository.create({
      equipoLocalId,
      equipoVisitanteId,
      fecha,
      golesLocal,
      golesVisitante,
      estado,
    });

    const savedPartido = await this.partidoRepository.save(partido);

    if (golesLocal > 0 || golesVisitante > 0) {
      await this.actualizarEstadisticas(equipoLocalId, equipoVisitanteId, golesLocal, golesVisitante);
    }

    return savedPartido;
  }

  async findAll(): Promise<Partido[]> {
    return this.partidoRepository.find();
  }

  async findOne(id: number): Promise<Partido> {
    const partido = await this.partidoRepository.findOne({ where: { id } });
    if (!partido) {
      throw new NotFoundException(`Partido con id ${id} no encontrado`);
    }
    return partido;
  }

  async update(id: number, updatePartidoDto: UpdatePartidoDto): Promise<Partido> {
    const partido = await this.partidoRepository.findOne({ where: { id } });
    if (!partido) {
      throw new NotFoundException(`Partido con id ${id} no encontrado`);
    }

    if (
      updatePartidoDto.equipoLocalId &&
      updatePartidoDto.equipoVisitanteId &&
      updatePartidoDto.equipoLocalId === updatePartidoDto.equipoVisitanteId
    ) {
      throw new BadRequestException('El equipo local y visitante no pueden ser el mismo');
    }

    // Guarda goles antes de actualizar para ajustar estadísticas si cambian
    const golesLocalAntes = partido.golesLocal;
    const golesVisitanteAntes = partido.golesVisitante;

    // Actualiza partido con nuevos valores
    Object.assign(partido, updatePartidoDto);
    if (updatePartidoDto.fecha) {
      partido.fecha = new Date(updatePartidoDto.fecha);
    }

    const updatedPartido = await this.partidoRepository.save(partido);

    // Si cambian los goles, actualizamos las estadísticas
    if (
      updatePartidoDto.golesLocal !== undefined &&
      updatePartidoDto.golesVisitante !== undefined &&
      (golesLocalAntes !== updatePartidoDto.golesLocal ||
        golesVisitanteAntes !== updatePartidoDto.golesVisitante)
    ) {
      // Primero, resta los goles antiguos
      await this.actualizarEstadisticas(
        partido.equipoLocalId,
        partido.equipoVisitanteId,
        -golesLocalAntes,
        -golesVisitanteAntes,
      );
      // Luego suma los goles nuevos
      await this.actualizarEstadisticas(
        partido.equipoLocalId,
        partido.equipoVisitanteId,
        updatePartidoDto.golesLocal,
        updatePartidoDto.golesVisitante,
      );
    }

    return updatedPartido;
  }

  async remove(id: number): Promise<void> {
    const partido = await this.partidoRepository.findOne({ where: { id } });
    if (!partido) {
      throw new NotFoundException(`Partido con id ${id} no encontrado`);
    }

    // Restar goles del partido antes de eliminar
    if (partido.golesLocal > 0 || partido.golesVisitante > 0) {
      await this.actualizarEstadisticas(
        partido.equipoLocalId,
        partido.equipoVisitanteId,
        -partido.golesLocal,
        -partido.golesVisitante,
      );
    }

    await this.partidoRepository.remove(partido);
  }

  private async actualizarEstadisticas(
    equipoLocalId: number,
    equipoVisitanteId: number,
    golesLocal: number,
    golesVisitante: number,
  ): Promise<void> {
    // Estadística local
    let estadLocal = await this.estadisticaRepository.findOne({ where: { equipoId: equipoLocalId } });
    if (!estadLocal) {
      estadLocal = this.estadisticaRepository.create({
        equipoId: equipoLocalId,
        golesFavor: 0,
        golesContra: 0,
      });
    }
    estadLocal.golesFavor += golesLocal;
    estadLocal.golesContra += golesVisitante;
    await this.estadisticaRepository.save(estadLocal);

    // Estadística visitante
    let estadVisitante = await this.estadisticaRepository.findOne({ where: { equipoId: equipoVisitanteId } });
    if (!estadVisitante) {
      estadVisitante = this.estadisticaRepository.create({
        equipoId: equipoVisitanteId,
        golesFavor: 0,
        golesContra: 0,
      });
    }
    estadVisitante.golesFavor += golesVisitante;
    estadVisitante.golesContra += golesLocal;
    await this.estadisticaRepository.save(estadVisitante);
  }
}
