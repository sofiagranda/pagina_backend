// curso.module.ts (o donde se declare el modelo)
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CursoSchema } from './schemas/curso.schema';
import { CursosController } from './cursos.controller';
import { CursosService } from './cursos.service';
import { ContenidoSchema } from './schemas/contenido.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Curso', schema: CursoSchema },
      { name: 'Contenido', schema: ContenidoSchema }
    ])
  ],
  controllers: [CursosController],
  providers: [CursosService]
})
export class CursoModule {}
