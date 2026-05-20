import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AttendanceModule } from './attendance/attendance.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CustomersModule,
    AppointmentsModule,
    AttendanceModule,
    MongooseModule.forRoot('mongodb://localhost:27017/duna-flow'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
