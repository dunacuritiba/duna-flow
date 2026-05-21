// src/attendance/dto/update-status.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../schema/attendance.schema';

export class UpdateStatusDto {
  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.NO_SAGUAO })
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;

  @ApiProperty({
    example: 'Dr. Roberto Santos',
    description: 'Nome do profissional que assumiu o atendimento',
    required: false,
  })
  @IsString()
  @IsOptional()
  servedBy?: string;
}
