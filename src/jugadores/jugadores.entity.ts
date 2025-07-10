import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Jugador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
  
  @Column()
  edad: number;

  @Column()
  posicion: string;

  @Column()
  equipoId: number; // Si haces relaciones, esto se ajusta.
  
  @Column({ nullable: true })
  foto: string;
  
  @Column({ nullable: true })
  pais: string;

  @Column({ default: true })
  isActive: boolean;
}


