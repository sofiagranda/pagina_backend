import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Equipo } from 'src/equipos/equipos.entity';

export enum EstadoPartido {
  PENDIENTE = 'pendiente',
  COMPLETO = 'completo',
}

@Entity()
export class Partido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  equipoLocalId: number;

  @Column()
  equipoVisitanteId: number;

  @ManyToOne(() => Equipo)
  @JoinColumn({ name: 'equipoLocalId' })
  equipoLocal: Equipo;

  @ManyToOne(() => Equipo)
  @JoinColumn({ name: 'equipoVisitanteId' })
  equipoVisitante: Equipo;

  @Column()
  fecha: Date;

  @Column({ default: 0 })
  golesLocal: number;

  @Column({ default: 0 })
  golesVisitante: number;

  @Column({
    type: 'enum',
    enum: EstadoPartido,
    default: EstadoPartido.PENDIENTE,
  })
  estado: EstadoPartido;
}
