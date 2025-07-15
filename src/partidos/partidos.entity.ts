import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Equipo } from 'src/equipos/equipos.entity';

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

  @Column({ type: 'varchar', length: 20, default: 'pendiente' })
  estado: string;
}
