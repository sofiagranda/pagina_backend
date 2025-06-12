import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Estadistica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jugadorId: number;

  @Column()
  goles: number;

  @Column()
  asistencias: number;
}
