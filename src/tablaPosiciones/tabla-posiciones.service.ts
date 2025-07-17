import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TablaPosiciones, TablaPosicionesDocument } from './schema/tabla-posiciones.schema';
import { UpdateTablaPosicionDto } from './dto/update-tabla-posiciom.dto';
import { Partido } from 'src/partidos/partidos.entity';

@Injectable()
export class TablaPosicionesService {
  constructor(
    @InjectModel(TablaPosiciones.name)
    private readonly tablaModel: Model<TablaPosicionesDocument>,
  ) { }

  async crearRegistro(data): Promise<TablaPosiciones> {
    const nuevoRegistro = new this.tablaModel(data);
    return nuevoRegistro.save();
  }

  async obtenerTodos(): Promise<TablaPosiciones[]> {
    return this.tablaModel.find().populate('equipoId').exec();
  }

  async actualizarRegistro(id: string, dto: UpdateTablaPosicionDto): Promise<TablaPosiciones | null> {
    return this.tablaModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async adjustGoles(partido: Partido, before: { golesLocal: number; golesVisitante: number }): Promise<void> {
    console.log('Ajustando goles de partido:', partido.id);
    const diffLocal = partido.golesLocal - before.golesLocal;
    const diffVisit = partido.golesVisitante - before.golesVisitante;

    const tablaLocal = await this.tablaModel.findOne({ equipoId: partido.equipoLocalId }).exec();
    const tablaVisit = await this.tablaModel.findOne({ equipoId: partido.equipoVisitanteId }).exec();

    console.log('Tabla local antes:', tablaLocal);
    console.log('Tabla visitante antes:', tablaVisit);

    if (tablaLocal) {
      tablaLocal.golesFavor -= before.golesLocal;
      tablaLocal.golesContra -= before.golesVisitante;
      tablaLocal.golesFavor += partido.golesLocal;
      tablaLocal.golesContra += partido.golesVisitante;
      tablaLocal.diferenciaGol = tablaLocal.golesFavor - tablaLocal.golesContra;
      await tablaLocal.save();
      console.log('Tabla local actualizada');
    } else {
      console.log('No se encontró tabla local para equipo', partido.equipoLocalId);
    }

    if (tablaVisit) {
      tablaVisit.golesFavor -= before.golesVisitante;
      tablaVisit.golesContra -= before.golesLocal;
      tablaVisit.golesFavor += partido.golesVisitante;
      tablaVisit.golesContra += partido.golesLocal;
      tablaVisit.diferenciaGol = tablaVisit.golesFavor - tablaVisit.golesContra;
      await tablaVisit.save();
      console.log('Tabla visitante actualizada');
    } else {
      console.log('No se encontró tabla visitante para equipo', partido.equipoVisitanteId);
    }
  }

  async markPlayed(partido: Partido): Promise<void> {
    console.log("➡️ Entrando a markPlaye()");

    const {
      equipoLocalId,
      equipoVisitanteId,
      golesLocal,
      golesVisitante,
    } = partido;

    const local = await this.tablaModel.findOne({ equipoId: equipoLocalId }).exec();
    const visit = await this.tablaModel.findOne({ equipoId: equipoVisitanteId }).exec();

    if (!local || !visit) {
      console.error('❌ No se encontró la tabla de posiciones para uno de los equipos');
      return;
    }

    // 1. Partidos jugados
    local.partidosJugados += 1;
    visit.partidosJugados += 1;

    // 2. Goles a favor y en contra
    local.golesFavor += golesLocal;
    local.golesContra += golesVisitante;

    visit.golesFavor += golesVisitante;
    visit.golesContra += golesLocal;

    // 3. Diferencia de gol
    local.diferenciaGol = local.golesFavor - local.golesContra;
    visit.diferenciaGol = visit.golesFavor - visit.golesContra;

    // 4. Ganado / Empatado / Perdido / Puntos
    if (golesLocal > golesVisitante) {
      local.partidosGanados += 1;
      local.puntos += 3;
      visit.partidosPerdidos += 1;
    } else if (golesVisitante > golesLocal) {
      visit.partidosGanados += 1;
      visit.puntos += 3;
      local.partidosPerdidos += 1;
    } else {
      local.partidosEmpatados += 1;
      visit.partidosEmpatados += 1;
      local.puntos += 1;
      visit.puntos += 1;
    }

    // 5. Guardar cambios
    await local.save();
    await visit.save();

    console.log(`✅ Tabla de posiciones actualizada para local (${equipoLocalId}) y visitante (${equipoVisitanteId})`);
  }

}

