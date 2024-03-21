import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('default')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // "/" 메인
  getHello(): string {
    return this.appService.getHello();
  }
}

/**
 * 기존 spring 패턴과 똑같아짐
 * controller -> service -> repository -> entity
 */