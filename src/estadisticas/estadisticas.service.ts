import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Estadistica } from './estadisticas.entity';
import { CreateEstadisticaDto } from './dto/create-estadisticas.dto';
import { UpdateEstadisticaDto } from './dto/update-estaditicas.dto';

// Importa entidad Equipo para acceder a su repositorio
import { Equipo } from '../equipos/equipos.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Estadistica)
    private readonly estadisticaRepo: Repository<Estadistica>,

    @InjectRepository(Equipo)
    private readonly equipoRepo: Repository<Equipo>, // Inyectamos repo de Equipos
  ) { }

  async create(dto: CreateEstadisticaDto): Promise<Estadistica> {
    const entity = this.estadisticaRepo.create(dto);
    return this.estadisticaRepo.save(entity);
  }

  async inicializarEstadisticasParaEquiposExistentes(): Promise<void> {
    const equipos = await this.equipoRepo.find();
    for (const equipo of equipos) {
      const existe = await this.estadisticaRepo.findOne({ where: { equipoId: equipo.id } });
      if (!existe) {
        const nuevaEstadistica = this.estadisticaRepo.create({
          equipoId: equipo.id,
          golesFavor: 0,
          golesContra: 0,
          tarjetasAmarillas: 0,
          tarjetasRojas: 0,
        });
        await this.estadisticaRepo.save(nuevaEstadistica);
      }
    }
  }


  async crearParaEquipo(equipoId: number): Promise<Estadistica> {
    const estadistica = this.estadisticaRepo.create({
      equipoId,
      golesFavor: 0,
      golesContra: 0,
      tarjetasAmarillas: 0,
      tarjetasRojas: 0,
    });
    return this.estadisticaRepo.save(estadistica);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Estadistica>> {
    const query = this.estadisticaRepo.createQueryBuilder('estadistica');
    return paginate(query, options);
  }

  async findOne(id: string): Promise<Estadistica | null> {
    return this.estadisticaRepo.findOne({ where: { id: Number(id) } });
  }


  async update(id: string, dto: UpdateEstadisticaDto): Promise<Estadistica | null> {
    const estadistica = await this.findOne(id);
    if (!estadistica) return null;

    Object.assign(estadistica, dto);
    return this.estadisticaRepo.save(estadistica);
  }

  async remove(id: string): Promise<Estadistica | null> {
    const estadistica = await this.findOne(id);
    if (!estadistica) return null;

    return this.estadisticaRepo.remove(estadistica);
  }
}
