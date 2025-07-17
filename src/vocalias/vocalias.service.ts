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
import { Estadistica } from 'src/estadisticas/estadisticas.entity';

@Injectable()
export class VocaliasService {
  constructor(
    @InjectModel(Vocalia.name) private readonly vocaliaModel: Model<VocaliaDocument>,
    @InjectRepository(Jugador) private readonly jugadorRepo: Repository<Jugador>,
    @InjectRepository(Estadistica) private readonly estadisticaRepo: Repository<Estadistica>,
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
    const jugadoresVisita = await this.jugadorRepo.find({
      where: { equipo: { id: equipoVisitanteId } },
      relations: ['equipo'], // para que cargue la relación
    });


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


  async updateVocaliaScore(partido: Partido): Promise<void> {
    await this.vocaliaModel.updateOne(
      { partidoId: partido.id },
      {
        $set: {
          golesLocal: partido.golesLocal,
          golesVisita: partido.golesVisitante,
        },
      }
    );
  }

  async actualizar(id: string, dto: UpdateVocaliaDto): Promise<Vocalia | null> {
    // Actualizar la vocalía por id con los campos del DTO
    const vocaliaActualizada = await this.vocaliaModel.findByIdAndUpdate(id, dto, { new: true });

    // Procesar tarjetas amarillas, si hay
    if (dto.tarjetasAmarillas && dto.tarjetasAmarillas.length > 0) {
      for (const tarjeta of dto.tarjetasAmarillas) {
        if (tarjeta.jugadorId && tarjeta.equipoId) {
          await this.registrarTarjeta(tarjeta.jugadorId, tarjeta.equipoId, 'amarilla');
        }
      }
    }

    // Procesar tarjetas rojas, si hay
    if (dto.tarjetasRojas && dto.tarjetasRojas.length > 0) {
      for (const tarjeta of dto.tarjetasRojas) {
        if (tarjeta.jugadorId && tarjeta.equipoId) {
          await this.registrarTarjeta(tarjeta.jugadorId, tarjeta.equipoId, 'roja');
        }
      }
    }

    return vocaliaActualizada;
  }
  async registrarTarjeta(
    jugadorId: number,
    equipoId: number,
    tipo: 'amarilla' | 'roja'
  ): Promise<void> {
    console.log("Repo estadistica es para:", this.estadisticaRepo.metadata.name);
    // 1. Buscar la vocalía activa (ejemplo: última creada)
    let vocalia = await this.vocaliaModel.findOne().sort({ _id: -1 }).exec();
    console.log("ingreso a registrar tarjeta")

    if (!vocalia) {
      vocalia = await this.vocaliaModel.create({
        tarjetasAmarillas: [],
        tarjetasRojas: [],
        partidoId: null,
        equipoLocalId: null,
        equipoVisitanteId: null,
        nominaLocal: [],
        nominaVisitante: [],
        golesLocal: 0,
        golesVisita: 0,
        goleadoresLocal: [],
        goleadoresVisita: [],
      });
    }

    // 2. Agregar la tarjeta en la vocalía
    const nuevaTarjeta = { jugadorId, equipoId };
    if (tipo === 'amarilla') {
      vocalia.tarjetasAmarillas.push(nuevaTarjeta);
    } else {
      vocalia.tarjetasRojas.push(nuevaTarjeta);
    }

    await vocalia.save();

    // 3. Actualizar jugador
    const jugador = await this.jugadorRepo.findOne({ where: { id: jugadorId } });
    if (!jugador) throw new Error('Jugador no encontrado');

    if (tipo === 'amarilla') {
      jugador.tarjetasAmarillas += 1;
    } else {
      jugador.tarjetasRojas += 1;
    }
    await this.jugadorRepo.save(jugador);

    // 4. Actualizar estadísticas del equipo
    const estadistica = await this.estadisticaRepo.findOne({ where: { equipoId } });
    console.log("Estadística encontrada:", estadistica);
    if (!estadistica) throw new Error('Estadísticas del equipo no encontradas');

    if (tipo === 'amarilla') {
      estadistica.tarjetasAmarillas += 1;
    } else {
      estadistica.tarjetasRojas += 1;
    }
    console.log("Estadística modificada:", estadistica);

    await this.estadisticaRepo.save(estadistica);
    console.log("Estadística guardada");

  }

}
