import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CustomerStatus } from '../schema/customers.schema';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do cliente',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Paciente',
    description: 'Papel ou tipo do cliente no fluxo',
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'Curitiba', description: 'Cidade de origem' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: '12345678901',
    description: 'Documento único (CPF, CNPJ ou RG)',
  })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty({
    example: '+55 41 99999-9999',
    description: 'Contato telefônico ou e-mail',
  })
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty({
    example: ['Check-in realizado às 14:00'],
    description: 'Histórico de notificações',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  notifications?: string[];

  @ApiProperty({
    enum: CustomerStatus,
    example: CustomerStatus.ACTIVE,
    description: 'Status do cadastro do cliente',
    required: false,
  })
  @IsEnum(CustomerStatus)
  @IsOptional()
  status?: CustomerStatus;
}
