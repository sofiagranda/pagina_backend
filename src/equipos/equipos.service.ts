import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from './equipos.entity';
import { CreateEquipoDto } from './dto/create-equipos.dto';
import { UpdateEquipoDto } from './dto/update-equipos.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { EstadisticasService } from '../estadisticas/estadisticas.service'; // Ajusta la ruta según tu proyecto

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepo: Repository<Equipo>,

    private readonly estadisticasService: EstadisticasService,
  ) {}

  async create(dto: CreateEquipoDto): Promise<Equipo | null> {
    try {
      const equipo = this.equipoRepo.create(dto);
      const nuevoEquipo = await this.equipoRepo.save(equipo);

      // Crear estadísticas iniciales para el equipo
      await this.estadisticasService.crearParaEquipo(nuevoEquipo.id);

      return nuevoEquipo;
    } catch (err) {
      console.error('Error creating equipo:', err);
      return null;
    }
  }

  async findAll(options: IPaginationOptions, isActive?: boolean): Promise<Pagination<Equipo> | null> {
    try {
      const query = this.equipoRepo.createQueryBuilder('equipo');
      if (isActive !== undefined) {
        query.where('equipo.isActive = :isActive', { isActive });
      }
      return await paginate<Equipo>(query, options);
    } catch (err) {
      console.error('Error retrieving equipos:', err);
      return null;
    }
  }

  async findOne(id: number): Promise<Equipo | null> {
    return await this.equipoRepo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateEquipoDto): Promise<Equipo | null> {
    const equipo = await this.findOne(id);
    if (!equipo) return null;

    Object.assign(equipo, dto);
    return await this.equipoRepo.save(equipo);
  }

  async remove(id: number): Promise<Equipo | null> {
    const equipo = await this.findOne(id);
    if (!equipo) return null;

    return await this.equipoRepo.remove(equipo);
  }

  async agregarFoto(id: number, foto: string): Promise<Equipo> {
    const equipo = await this.equipoRepo.findOne({ where: { id } });
    if (!equipo) throw new NotFoundException('Equipo no encontrado');

    equipo.foto = foto;
    return await this.equipoRepo.save(equipo);
  }
}
