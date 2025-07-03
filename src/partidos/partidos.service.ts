import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partidos.dto';
import { UpdatePartidoDto } from './dto/update-partidos.dto';

export interface Partido {
  id: number;
  equipoLocal: string;
  equipoVisitante: string;
  fecha: Date;
  golesLocal?: number;
  golesVisitante?: number;
  estado?: string;
}

@Injectable()
export class PartidosService {
  private partidos: Partido[] = [];
  private idCounter = 1;
  prisma: any;

  create(createPartidoDto: CreatePartidoDto): Partido {
    const nuevoPartido: Partido = {
      id: this.idCounter++,
      equipoLocal: createPartidoDto.equipoLocal,
      equipoVisitante: createPartidoDto.equipoVisitante,
      fecha: new Date(createPartidoDto.fecha),
      golesLocal: createPartidoDto.golesLocal ?? 0,
      golesVisitante: createPartidoDto.golesVisitante ?? 0,
      estado: createPartidoDto.estado ?? 'pendiente',
    };
    this.partidos.push(nuevoPartido);
    return nuevoPartido;
  }

  update(id: number, updatePartidoDto: UpdatePartidoDto): Partido {
    const partidoIndex = this.partidos.findIndex((p) => p.id === id);
    if (partidoIndex === -1) {
      throw new NotFoundException(`Partido con id ${id} no encontrado`);
    }
    const partidoActual = this.partidos[partidoIndex];
    const partidoActualizado = {
      ...partidoActual,
      ...updatePartidoDto,
      fecha: updatePartidoDto.fecha ? new Date(updatePartidoDto.fecha) : partidoActual.fecha,
    };
    this.partidos[partidoIndex] = partidoActualizado;
    return partidoActualizado;
  }

  // Opcional: método para obtener todos los partidos
  findAll(): Partido[] {
    return this.partidos;
  }
  async remove(id: number) {
  const partido = await this.prisma.partido.findUnique({ where: { id } });
  if (!partido) {
    throw new NotFoundException(`Partido con ID ${id} no encontrado`);
  }

  return await this.prisma.partido.delete({ where: { id } });
}
}
