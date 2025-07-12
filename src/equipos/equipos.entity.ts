// src/equipos/equipo.entity.ts
import { Estadistica } from 'src/estadisticas/estadisticas.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity()
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  fundacion: number;

  @Column({ nullable: true })
  foto: string;

  @OneToOne(() => Estadistica, estadistica => estadistica.equipo, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  estadistica: Estadistica; // ✅ Aquí defines la propiedad
}
