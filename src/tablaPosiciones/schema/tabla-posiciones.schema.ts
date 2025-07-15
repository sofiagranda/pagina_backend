import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TablaPosicionesDocument = TablaPosiciones & Document;

@Schema()
export class TablaPosiciones {
  @Prop()
  equipoId:number;

  @Prop({ default: 0 })
  puntos: number;

  @Prop({ default: 0 })
  partidosJugados: number;

  @Prop({ default: 0 })
  partidosGanados: number;

  @Prop({ default: 0 })
  partidosEmpatados: number;

  @Prop({ default: 0 })
  partidosPerdidos: number;

  @Prop({ default: 0 })
  golesFavor: number;

  @Prop({ default: 0 })
  golesContra: number;

  @Prop({ default: 0 })
  diferenciaGol: number;
}

export const TablaPosicionesSchema = SchemaFactory.createForClass(TablaPosiciones);
