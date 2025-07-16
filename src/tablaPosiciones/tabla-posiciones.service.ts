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
    console.log("entrada a markplayed exitosa")
    const local = await this.tablaModel.findOne({ equipoId: partido.equipoLocalId }).exec();
    const visit = await this.tablaModel.findOne({ equipoId: partido.equipoVisitanteId }).exec();

    if (local) {
      local.partidosJugados += 1;
      await local.save();
      console.log(`✅ Partido jugado contado para local: ${local.equipoId}`);

    }

    if (visit) {
      visit.partidosJugados += 1;
      await visit.save();
      console.log(`✅ Partido jugado contado para visitante: ${visit.equipoId}`);
    }
  }
}

