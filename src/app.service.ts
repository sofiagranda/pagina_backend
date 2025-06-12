import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hola bienvenivdo al Torneo Copa Los De Solanda';
  }
}
