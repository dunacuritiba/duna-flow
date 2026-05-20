// src/customers/customers.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerDto } from './dto/create-customer.dto';
import {
  Customer,
  CustomerDocument,
  CustomerStatus,
} from './schema/customers.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  // 1. Criar novo cliente (Cadastro rápido na recepção)
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const { document } = createCustomerDto;

    // Verifica se já existe um cliente com o mesmo documento
    const exists = await this.customerModel.findOne({ document }).exec();
    if (exists) {
      throw new ConflictException(
        'Já existe um cliente cadastrado com este documento.',
      );
    }

    const newCustomer = new this.customerModel(createCustomerDto);
    return newCustomer.save();
  }

  // 2. Buscar todos os clientes (com opção de filtrar por status)
  async findAll(status?: CustomerStatus): Promise<Customer[]> {
    const filter = status ? { status } : {};
    return this.customerModel.find(filter).exec();
  }

  // 3. Buscar cliente por ID interno
  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado com o ID fornecido.');
    }
    return customer;
  }

  // 4. Buscar cliente por documento (CPF/CNPJ na recepção)
  async findByDocument(document: string): Promise<Customer> {
    const customer = await this.customerModel.findOne({ document }).exec();
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado com este documento.');
    }
    return customer;
  }

  // 5. Adicionar uma notificação ao histórico do cliente
  async addNotification(id: string, message: string): Promise<Customer> {
    const updatedCustomer = await this.customerModel
      .findByIdAndUpdate(
        id,
        { $push: { notifications: message } },
        { new: true },
      )
      .exec();

    if (!updatedCustomer) {
      throw new NotFoundException(
        'Cliente não encontrado para atualizar notificações.',
      );
    }
    return updatedCustomer;
  }
}
