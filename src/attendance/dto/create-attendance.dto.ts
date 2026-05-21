import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({
    example: '65f1a2b3c4d5e6f7a8b9c0d1',
    description: 'ID do cliente cadastrado no MongoDB',
  })
  @IsMongoId()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({
    example: 'Recepcionista Maria',
    description: 'Quem está registrando a entrada',
    required: false,
  })
  @IsString()
  @IsOptional()
  servedBy?: string;
}
