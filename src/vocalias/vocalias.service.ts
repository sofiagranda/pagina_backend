import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vocalia, VocaliaDocument } from './schemas/vocalias.schema';
import { CreateVocaliaDto } from './dto/create-vocalias.dto';
import { UpdateVocaliaDto } from './dto/update-vocalias.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Jugador } from 'src/jugadores/jugadores.entity';
import { Repository } from 'typeorm';
import { Partido } from 'src/partidos/partidos.entity';

@Injectable()
export class VocaliasService {
  constructor(
    @InjectModel(Vocalia.name) private readonly vocaliaModel: Model<VocaliaDocument>,
    @InjectRepository(Jugador) private readonly jugadorRepo: Repository<Jugador>,
  ) { }

  async crear(dto: CreateVocaliaDto): Promise<Vocalia> {
    const vocalia = new this.vocaliaModel(dto);
    return vocalia.save();
  }

  async createVocaliaDesdePartido(partido: Partido) {
    console.log('createVocaliaDesdePartido llamado con partido:', partido.id);
    const { id, equipoLocalId, equipoVisitanteId, golesLocal, golesVisitante } = partido;

    const jugadoresLocal = await this.jugadorRepo.find({
      where: { equipo: { id: equipoLocalId } },
      relations: ['equipo'], // para que cargue la relación
    });
    console.log('Jugadores Local:', jugadoresLocal);
    const jugadoresVisita = await this.jugadorRepo.find({
      where: { equipo: { id: equipoVisitanteId } },
      relations: ['equipo'], // para que cargue la relación
    });
    console.log('Jugadores Local:', jugadoresVisita);


    const nominaLocal = jugadoresLocal.map(j => ({
      jugadorId: j.id,
      equipoId: equipoLocalId,
      jugo: false,
    }));

    const nominaVisitante = jugadoresVisita.map(j => ({
      jugadorId: j.id,
      equipoId: equipoVisitanteId,
      jugo: false,
    }));

    return await this.vocaliaModel.create({
      partidoId: id,
      equipoLocalId,
      equipoVisitanteId,
      golesLocal: golesLocal || 0,
      golesVisita: golesVisitante || 0,
      nominaLocal,
      nominaVisitante,
      goleadoresLocal: [],
      goleadoresVisita: [],
      tarjetasAmarillas: [],
      tarjetasRojas: [],
    });
  }


  async obtenerTodas(): Promise<Vocalia[]> {
    return this.vocaliaModel.find().exec();
  }

  async obtenerUno(id: string): Promise<Vocalia | null> {
    return this.vocaliaModel.findById(id).exec();
  }

  async actualizar(id: string, dto: UpdateVocaliaDto): Promise<Vocalia | null> {
    return this.vocaliaModel.findByIdAndUpdate(id, dto, { new: true });
  }
}
