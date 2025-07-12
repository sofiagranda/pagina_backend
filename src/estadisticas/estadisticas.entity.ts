import { Equipo } from 'src/equipos/equipos.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Estadistica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  equipoId: number;

  @OneToOne(() => Equipo, equipo => equipo.estadistica)
  @JoinColumn({ name: 'equipoId' }) // ✅ Esto hace la unión real
  equipo: Equipo;

  @Column({ default: 0 })
  golesFavor: number;

  @Column({ default: 0 })
  golesContra: number;

  @Column({ default: 0 })
  tarjetasAmarillas: number;

  @Column({ default: 0 })
  tarjetasRojas: number;
}
