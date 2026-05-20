// src/customers/schemas/customer.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

// Definindo o Enum de Status do Cliente
export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

@Schema({ timestamps: true, collection: 'customers' })
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  role: string; // Ex: "Paciente", "Cliente", "Visitante"

  @Prop({ required: true })
  city: string;

  @Prop({ required: true, unique: true, index: true })
  document: string; // CPF, CNPJ, etc.

  @Prop({ required: true })
  contact: string;

  @Prop({ type: [String], default: [] })
  notifications: string[]; // Array de strings nativo do Mongo

  @Prop({ type: String, enum: CustomerStatus, default: CustomerStatus.ACTIVE })
  status: CustomerStatus;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
