import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Attendance,
  AttendanceDocument,
  AttendanceStatus,
} from './schema/attendance.schema';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const { customerId } = createAttendanceDto;
    const activeAttendance: any = this.attendanceModel
      .findOne({
        customer: new Types.ObjectId(customerId),
        status: {
          $nin: [AttendanceStatus.CONCLUIDO, AttendanceStatus.CANCELADO],
        },
      })
      .exec();

    if (activeAttendance) {
      throw new BadRequestException(
        'Este cliente já possui um atendimento ativo na fila.',
      );
    }

    const newAttendance = new this.attendanceModel({
      customer: createAttendanceDto.customerId,
      servedBy: createAttendanceDto.servedBy,
      status: AttendanceStatus.AGUARDANDO_RECEPCAO,
    });

    return (await newAttendance.save()).populate('customer');
  }

  // 2. Buscar fila ativa ordenada por tempo de chegada (Ordem de Chegada)
  async getActiveQueue(status?: AttendanceStatus): Promise<Attendance[]> {
    const query: any = status
      ? { status }
      : {
          status: {
            $in: [
              AttendanceStatus.AGUARDANDO_RECEPCAO,
              AttendanceStatus.NO_SAGUAO,
              AttendanceStatus.SALA_ESPERA_INTERNA,
              AttendanceStatus.EM_ATENDIMENTO,
            ],
          },
        };

    // Ordena pelo mais antigo na fila (enteredAt: 1) trazendo os dados do Customer juntos (.populate)
    return this.attendanceModel
      .find(query)
      .populate('customer')
      .sort({ enteredAt: 1 })
      .exec();
  }

  // 3. Atualizar Status/Movimentar cliente na esteira
  async updateStatus(
    id: string,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Attendance> {
    const { status, servedBy } = updateStatusDto;
    const updateData: any = { status };

    if (servedBy) {
      updateData.servedBy = servedBy;
    }

    // Se o atendimento está sendo finalizado, grava a data de encerramento
    if (
      status === AttendanceStatus.CONCLUIDO ||
      status === AttendanceStatus.CANCELADO
    ) {
      updateData.closedAt = new Date();
    }

    const updated = await this.attendanceModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('customer')
      .exec();

    if (!updated) {
      throw new NotFoundException('Registro de atendimento não encontrado.');
    }

    return updated;
  }

  // 4. Histórico Geral (Atendimentos já encerrados)
  async getHistory(): Promise<Attendance[]> {
    return this.attendanceModel
      .find({
        status: {
          $in: [AttendanceStatus.CONCLUIDO, AttendanceStatus.CANCELADO],
        },
      })
      .populate('customer')
      .sort({ closedAt: -1 })
      .exec();
  }
}
