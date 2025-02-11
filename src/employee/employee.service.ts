import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { next } from 'src/common/utils/handleError.util';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const employee = await this.prisma.empleados.findFirst({
        where: {
          cedula: createEmployeeDto.ci
        }
      });

      if (employee) {
        throw new HttpException(
          'ya existe un empleado con esta cedula',
          HttpStatus.BAD_REQUEST
        );
      }

      const worker = await this.prisma.empleados.create({
        data: {
          cedula: createEmployeeDto.ci,
          direccion: createEmployeeDto.direccion,
          telf: createEmployeeDto.telf,
          nombre_apellido: createEmployeeDto.fullName,
          cargo: createEmployeeDto.cargo
        }
      });

      await this.prisma.usuario.create({
        data: {
          empleado_id: worker.id,
          name: worker.cedula,
          password: bcrypt.hashSync(worker.cedula, 10)
        }
      });

      return {
        msg: 'empleado y usuario creado'
      };
    } catch (error) {
      next('error creando empleado', error);
    }
  }

  async findAll() {
    try {
      const employee = await this.prisma.empleados.findMany({
        where: {
          is_active: true
        }
      });
      if (employee.length <= 0) {
        throw new HttpException('no hay empleados', HttpStatus.BAD_REQUEST);
      }

      return employee;
    } catch (error) {
      next('error buscando empleados', error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      await this.prisma.empleados.update({
        where: {
          id: id
        },
        data: {
          cedula: updateEmployeeDto.ci,
          direccion: updateEmployeeDto.direccion,
          telf: updateEmployeeDto.telf,
          nombre_apellido: updateEmployeeDto.fullName,
          cargo: updateEmployeeDto.cargo
        }
      });

      return {
        msg: 'empleado editado'
      };
    } catch (error) {
      next('error editando empleado', error);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.empleados.update({
        where: {
          id: id
        },
        data: {
          is_active: false
        }
      });

      await this.prisma.usuario.updateMany({
        where: {
          empleado_id: id
        },
        data: {
          is_active: false
        }
      });

      return {
        msg: 'empleado eliminado'
      };
    } catch (error) {
      next('error eliminando empleado', error);
    }
  }
}
