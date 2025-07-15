import { Equipo } from 'src/equipos/equipos.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Jugador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ nullable: true })
  edad: number;

  @Column()
  posicion: string;

  @ManyToOne(() => Equipo, equipo => equipo.jugadores)
  @JoinColumn({ name: 'equipoId' })
  equipo: Equipo;

  @Column()
  equipoId: number; // Si haces relaciones, esto se ajusta.

  @Column({ nullable: true })
  foto: string;

  @Column({ nullable: true })
  pais: string;

  @Column({ default: 0 })
  goles: number;

  @Column({ default: 0 })
  tarjetasAmarillas: number;

  @Column({ default: 0 })
  tarjetasRojas: number;

  @Column({ default: 0 })
  partidosJugados: number;

  @Column({ default: true })
  isActive: boolean;
}


