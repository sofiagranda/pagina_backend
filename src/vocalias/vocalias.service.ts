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
    const { id, equipoLocalId, equipoVisitanteId, golesLocal, golesVisitante } = partido;

    const jugadoresLocal = await this.jugadorRepo.find({
      where: { equipo: { id: equipoLocalId } },
      relations: ['equipo'],
    });

    const jugadoresVisita = await this.jugadorRepo.find({
      where: { equipo: { id: equipoVisitanteId } },
      relations: ['equipo'],
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
      },
    );
  }

  async actualizar(id: string, dto: UpdateVocaliaDto): Promise<Vocalia | null> {
    const vocaliaOriginal = await this.vocaliaModel.findById(id);
    const vocaliaActualizada = await this.vocaliaModel.findByIdAndUpdate(id, dto, { new: true });

    if (!vocaliaOriginal) return vocaliaActualizada;

    await this.procesarCambiosDeJugo(vocaliaOriginal, dto);
    await this.procesarTarjetas(dto);

    return vocaliaActualizada;
  }

  private async procesarCambiosDeJugo(original: Vocalia, dto: UpdateVocaliaDto): Promise<void> {
    const procesar = async (nuevos: any[], originales: any[]) => {
      for (const nuevo of nuevos) {
        const viejo = originales.find(v => v.jugadorId === nuevo.jugadorId);
        if (viejo && nuevo.jugo !== viejo.jugo) {
          await this.actualizarPartidosJugados(nuevo.jugadorId, nuevo.jugo);
        }
      }
    };

    if (dto.nominaLocal) {
      await procesar(dto.nominaLocal, original.nominaLocal || []);
    }

    if (dto.nominaVisitante) {
      await procesar(dto.nominaVisitante, original.nominaVisitante || []);
    }
  }

  private async actualizarPartidosJugados(jugadorId: number, jugo: boolean): Promise<void> {
    const jugador = await this.jugadorRepo.findOne({ where: { id: jugadorId } });
    if (!jugador) return;

    if (jugo) {
      jugador.partidosJugados += 1;
    } else {
      jugador.partidosJugados = Math.max(0, jugador.partidosJugados - 1);
    }

    await this.jugadorRepo.save(jugador);
  }

  private async procesarTarjetas(dto: UpdateVocaliaDto): Promise<void> {
    if (dto.tarjetasAmarillas?.length) {
      for (const tarjeta of dto.tarjetasAmarillas) {
        if (tarjeta.jugadorId && tarjeta.equipoId) {
          await this.registrarTarjeta(tarjeta.jugadorId, tarjeta.equipoId, 'amarilla');
        }
      }
    }

    if (dto.tarjetasRojas?.length) {
      for (const tarjeta of dto.tarjetasRojas) {
        if (tarjeta.jugadorId && tarjeta.equipoId) {
          await this.registrarTarjeta(tarjeta.jugadorId, tarjeta.equipoId, 'roja');
        }
      }
    }
  }

  async registrarTarjeta(
    jugadorId: number,
    equipoId: number,
    tipo: 'amarilla' | 'roja',
  ): Promise<void> {
    console.log('Repo estadistica es para:', this.estadisticaRepo.metadata.name);

    let vocalia = await this.vocaliaModel.findOne().sort({ _id: -1 }).exec();
    console.log('ingreso a registrar tarjeta');

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

    const nuevaTarjeta = { jugadorId, equipoId };
    if (tipo === 'amarilla') {
      vocalia.tarjetasAmarillas.push(nuevaTarjeta);
    } else {
      vocalia.tarjetasRojas.push(nuevaTarjeta);
    }

    await vocalia.save();

    const jugador = await this.jugadorRepo.findOne({ where: { id: jugadorId } });
    if (!jugador) throw new Error('Jugador no encontrado');

    if (tipo === 'amarilla') {
      jugador.tarjetasAmarillas += 1;
    } else {
      jugador.tarjetasRojas += 1;
    }
    await this.jugadorRepo.save(jugador);

    const estadistica = await this.estadisticaRepo.findOne({ where: { equipoId } });
    console.log('Estadística encontrada:', estadistica);
    if (!estadistica) throw new Error('Estadísticas del equipo no encontradas');

    if (tipo === 'amarilla') {
      estadistica.tarjetasAmarillas += 1;
    } else {
      estadistica.tarjetasRojas += 1;
    }
    console.log('Estadística modificada:', estadistica);

    await this.estadisticaRepo.save(estadistica);
    console.log('Estadística guardada');
  }
}
