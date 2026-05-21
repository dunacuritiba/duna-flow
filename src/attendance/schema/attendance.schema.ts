// src/attendance/schemas/attendance.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Customer } from '../../customers/schema/customers.schema';

export type AttendanceDocument = Attendance & Document;

export enum AttendanceStatus {
  AGUARDANDO_RECEPCAO = 'AGUARDANDO NA RECEPÇÃO',
  NO_SAGUAO = 'AGUARDANDO ASSESSORIA TÉCNICA',
  SALA_ESPERA_INTERNA = 'SALA DE ESPERA GS',
  EM_ATENDIMENTO = 'EM ATENDIMENTO',
  CONCLUIDO = 'CONCLUÍDO',
  CANCELADO = 'CANCELADO',
}

@Schema({ timestamps: true, collection: 'attendances' })
export class Attendance {
  // Vincula o atendimento ao ID do Customer do MongoDB
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true,
  })
  customer: Customer | Types.ObjectId;

  @Prop({
    type: String,
    enum: AttendanceStatus,
    default: AttendanceStatus.AGUARDANDO_RECEPCAO,
    index: true,
  })
  status: AttendanceStatus;

  @Prop({ type: Date, default: Date.now })
  enteredAt: Date; // Data/Hora que entrou no fluxo atual

  @Prop({ type: Date })
  closedAt: Date; // Data/Hora que o atendimento foi Concluído ou Cancelado

  @Prop({ type: String })
  servedBy: string; // Nome ou ID do profissional/recepcionista que atendeu a pessoa
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
