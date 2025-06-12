import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Jugador } from './jugadores.entity';
import { CreateJugadorDto } from './dto/create-jugadores.dto';
import { UpdateJugadorDto } from './dto/update-jugadores.dto';

@Injectable()
export class JugadoresService {
  constructor(
    @InjectRepository(Jugador)
    private readonly jugadorRepo: Repository<Jugador>,
  ) {}

  async create(dto: CreateJugadorDto): Promise<Jugador | null> {
    try {
      const jugador = this.jugadorRepo.create(dto);
      return await this.jugadorRepo.save(jugador);
    } catch (err) {
      console.error('Error creating jugador:', err);
      return null;
    }
  }

  async findAll(options: IPaginationOptions, isActive?: boolean): Promise<Pagination<Jugador> | null> {
    try {
      const query = this.jugadorRepo.createQueryBuilder('jugador');
      if (isActive !== undefined) {
        query.where('jugador.isActive = :isActive', { isActive });
      }
      return await paginate<Jugador>(query, options);
    } catch (err) {
      console.error('Error retrieving jugadores:', err);
      return null;
    }
  }

  async findOne(id: number): Promise<Jugador | null> {
    try {
      return await this.jugadorRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error finding jugador:', err);
      return null;
    }
  }

  async update(id: number, dto: UpdateJugadorDto): Promise<Jugador | null> {
    try {
      const jugador = await this.findOne(id);
      if (!jugador) return null;

      Object.assign(jugador, dto);
      return await this.jugadorRepo.save(jugador);
    } catch (err) {
      console.error('Error updating jugador:', err);
      return null;
    }
  }

  async remove(id: number): Promise<Jugador | null> {
    try {
      const jugador = await this.findOne(id);
      if (!jugador) return null;

      return await this.jugadorRepo.remove(jugador);
    } catch (err) {
      console.error('Error deleting jugador:', err);
      return null;
    }
  }

  async updateFoto(id: number, filename: string): Promise<Jugador | null> {
    try {
      const jugador = await this.findOne(id);
      if (!jugador) return null;

      jugador.foto = filename;
      return await this.jugadorRepo.save(jugador);
    } catch (err) {
      console.error('Error updating jugador photo:', err);
      return null;
    }
  }
}
