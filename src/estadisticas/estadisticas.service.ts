import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Estadistica } from './estadisticas.entity';
import { CreateEstadisticaDto } from './dto/create-estadisticas.dto';
import { UpdateEstadisticaDto } from './dto/update-estaditicas.dto';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Estadistica)
    private readonly estadisticaRepo: Repository<Estadistica>,
  ) {}

  async create(dto: CreateEstadisticaDto): Promise<Estadistica> {
    const entity = this.estadisticaRepo.create(dto);
    return this.estadisticaRepo.save(entity);
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
