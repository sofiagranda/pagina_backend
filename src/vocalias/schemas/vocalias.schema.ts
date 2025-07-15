import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VocaliaDocument = Vocalia & Document;

@Schema({ timestamps: true })
export class Vocalia {
  @Prop({ required: true })
  partidoId: number;

  @Prop({ required: true })
  equipoLocalId: number;

  @Prop({ required: true })
  equipoVisitanteId: number;

  @Prop({ default: 0 })
  golesLocal: number;

  @Prop({ default: 0 })
  golesVisita: number;

  @Prop([{
    jugadorId: Number,
    equipoId: Number,
    jugo: Boolean,
  }])
  nominaLocal: { jugadorId: number; equipoId: number; jugo: boolean }[];

  @Prop([{
    jugadorId: Number,
    equipoId: Number,
    jugo: Boolean,
  }])
  nominaVisitante: { jugadorId: number; equipoId: number; jugo: boolean }[];

  @Prop([{
    jugadorId: Number,
    numeroGoles: Number,
  }])
  goleadoresLocal: { jugadorId: number; numeroGoles: number }[];

  @Prop([{
    jugadorId: Number,
    numeroGoles: Number,
  }])
  goleadoresVisita: { jugadorId: number; numeroGoles: number }[];

  @Prop([{
    jugadorId: Number,
    equipoId: Number,
  }])
  tarjetasAmarillas: { jugadorId: number; equipoId: number }[];

  @Prop([{
    jugadorId: Number,
    equipoId: Number,
  }])
  tarjetasRojas: { jugadorId: number; equipoId: number }[];
}

export const VocaliaSchema = SchemaFactory.createForClass(Vocalia);
