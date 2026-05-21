// src/attendance/attendance.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance, AttendanceSchema } from './schema/attendance.schema';
import { CustomersModule } from '../customers/customers.module'; // Importa para o populate funcionar

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
    ]),
    // Importa o módulo de clientes para que o Mongoose consiga resolver a relação do populate('customer')
    CustomersModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService], // Exportamos caso o módulo de agendamentos precise dele no futuro
})
export class AttendanceModule {}
