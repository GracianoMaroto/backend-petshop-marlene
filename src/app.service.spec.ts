import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('should return application health status', () => {
    expect(service.getHealth()).toEqual({
      name: 'PetShop DM API',
      status: 'ok',
    });
  });
});
