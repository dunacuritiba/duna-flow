// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração global de validação (para os DTOs funcionarem)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Duna Flow API')
    .setDescription(
      'API para gerenciamento de fluxo de atendimento e filas de espera',
    )
    .setVersion('1.0')
    .addTag('customers', 'Gerenciamento de Clientes')
    .addTag('appointments', 'Agendamentos de Horários')
    .addTag('attendance', 'Motor do Fluxo de Atendimento e Filas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Define a rota onde o Swagger vai rodar (ex: http://localhost:3000/api)
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`🚀 Duna-Flow rodando em: http://localhost:3000`);
  console.log(`📄 Documentação Swagger em: http://localhost:3000/api`);
}
bootstrap();
