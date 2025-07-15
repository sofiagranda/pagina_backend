import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EquiposModule } from './equipos/equipos.module';
import { JugadoresModule } from './jugadores/jugadores.module';
import { PartidosModule } from './partidos/partidos.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CursoModule } from './cursos/cursos.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TablaPosicionesModule } from './tablaPosiciones/tabla-posiciones.module';


@Module({ 
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: { rejectUnauthorized: false }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Ruta donde están tus archivos públicos (como logos)
      serveRoot: '/public',  // Hace que las imágenes sean accesibles desde http://localhost:3000/public
    }),
    EquiposModule,
    JugadoresModule,
    PartidosModule,
    EstadisticasModule,
    CursoModule,
    TablaPosicionesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
  