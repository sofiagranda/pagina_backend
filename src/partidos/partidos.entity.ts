import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Partido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  equipoLocal: string;

  @Column({ type: 'varchar', length: 100 })
  equipoVisitante: string;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'int', default: 0 })
  golesLocal: number;

  @Column({ type: 'int', default: 0 })
  golesVisitante: number;

  @Column({ type: 'varchar', length: 20, default: 'pendiente' })
  estado: string;
}
