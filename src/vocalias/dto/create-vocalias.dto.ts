export class CreateVocaliaDto {
  partidoId: number;
  equipoLocalId: number;
  equipoVisitanteId: number;
  golesLocal: number;
  golesVisita: number;
  nominaLocal: { jugadorId: number; equipoId: number; jugo: boolean }[];
  nominaVisitante: { jugadorId: number; equipoId: number; jugo: boolean }[];
  goleadoresLocal: { jugadorId: number; numeroGoles: number }[];
  goleadoresVisita: { jugadorId: number; numeroGoles: number }[];
  tarjetasAmarillas: { jugadorId: number; equipoId: number }[];
  tarjetasRojas: { jugadorId: number; equipoId: number }[];
}
