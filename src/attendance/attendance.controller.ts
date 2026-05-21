// src/attendance/attendance.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AttendanceStatus } from './schema/attendance.schema';

@ApiTags('attendance') // Agrupa este controller no painel do Swagger
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @ApiOperation({
    summary:
      'Registra a entrada (check-in) de um cliente no fluxo de atendimento',
  })
  @ApiResponse({
    status: 201,
    description: 'Atendimento iniciado e cliente inserido na fila.',
  })
  @ApiResponse({
    status: 400,
    description: 'Cliente já possui um atendimento ativo na fila.',
  })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get('queue')
  @ApiOperation({
    summary: 'Retorna a fila de espera ativa por ordem de chegada',
  })
  @ApiQuery({
    name: 'status',
    enum: AttendanceStatus,
    required: false,
    description:
      'Filtrar por um status específico da fila (ex: NO_SAGUAO, SALA_ESPERA_INTERNA)',
  })
  getQueue(@Query('status') status?: AttendanceStatus) {
    return this.attendanceService.getActiveQueue(status);
  }

  @Patch(':id/move')
  @ApiOperation({
    summary: 'Movimenta o cliente de sala ou altera o status do atendimento',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do registro de Atendimento (ObjectId)',
  })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Registro de atendimento não encontrado.',
  })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.attendanceService.updateStatus(id, updateStatusDto);
  }

  @Get('history')
  @ApiOperation({
    summary:
      'Retorna o histórico geral de atendimentos encerrados (Concluídos ou Cancelados)',
  })
  getHistory() {
    return this.attendanceService.getHistory();
  }
}
