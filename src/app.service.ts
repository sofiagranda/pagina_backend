import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hola bienvenido al Torneo Copa Los De Solanda';
  }
}
