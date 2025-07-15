import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TablaPosiciones, TablaPosicionesDocument } from './schema/tabla-posiciones.schema';
import { UpdateTablaPosicionDto } from './dto/update-tabla-posiciom.dto';

@Injectable()
export class TablaPosicionesService {
  constructor(
    @InjectModel(TablaPosiciones.name)
    private readonly tablaModel: Model<TablaPosicionesDocument>,
  ) {}

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
}
