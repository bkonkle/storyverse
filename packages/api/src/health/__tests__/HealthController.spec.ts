import {Test, TestingModule} from '@nestjs/testing'

import {HealthController} from '../HealthController'

describe('Health Controller', () => {
  let controller: HealthController

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile()

    controller = module.get<HealthController>(HealthController)
  })

  describe('ping', () => {
    it('returns a pong response', () => {
      expect(controller.ping()).toStrictEqual({pong: true})
    })
  })
})
