import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { service: string; version: string, status: boolean } {
    return {
      service: 'estadisticas-api',
      version: '2025.07.10',
      status: true,
    };
  }
}
