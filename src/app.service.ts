import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      name: 'PetShop DM API',
      status: 'ok',
    };
  }
}
