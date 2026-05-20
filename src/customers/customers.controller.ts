// src/customers/customers.controller.ts
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerStatus } from './schema/customers.schema';

@ApiTags('customers') // Grupo no painel do Swagger
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra um novo cliente na recepção' })
  @ApiResponse({ status: 201, description: 'Cliente cadastrado com sucesso.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Documento já cadastrado.',
  })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os clientes cadastrados' })
  @ApiQuery({
    name: 'status',
    enum: CustomerStatus,
    required: false,
    description: 'Filtrar por status do cliente',
  })
  findAll(@Query('status') status?: CustomerStatus) {
    return this.customersService.findAll(status);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Busca um cliente pelo número do documento (CPF/CNPJ)',
  })
  @ApiQuery({
    name: 'document',
    description: 'Número do documento do cliente',
    example: '12345678901',
  })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  findByDocument(@Query('document') document: string) {
    return this.customersService.findByDocument(document);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca os dados de um cliente pelo ID interno' })
  @ApiParam({ name: 'id', description: 'ID gerado pelo MongoDB (ObjectId)' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Post(':id/notify')
  @ApiOperation({
    summary: 'Adiciona uma mensagem ao histórico de notificações do cliente',
  })
  addNotification(@Param('id') id: string, @Body('message') message: string) {
    return this.customersService.addNotification(id, message);
  }
}
