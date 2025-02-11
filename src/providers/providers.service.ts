import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { next } from 'src/common/utils/handleError.util';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async create(createProviderDto: CreateProviderDto) {
    try {
      console.log({ createProviderDto });
      const provider = await this.prisma.proveedor.findFirst({
        where: {
          OR: [
            { nombre: createProviderDto.nombre },
            { rif: createProviderDto.rif },
            { email: createProviderDto.email }
          ]
        }
      });

      if (provider) {
        throw new HttpException(
          'el nombre de proveedor o rif ya existe',
          HttpStatus.BAD_REQUEST
        );
      }

      await this.prisma.proveedor.create({
        data: {
          nombre: createProviderDto.nombre,
          telefono: createProviderDto.telefono,
          rif: createProviderDto.rif,
          direccion: createProviderDto.direccion,
          email: createProviderDto.email
        }
      });

      return {
        msg: 'proveedor creado'
      };
    } catch (error) {
      next('error creando el proveedor', error);
    }
  }

  async findOne(id: number) {
    try {
      const provider = await this.prisma.producto.findUnique({
        where: {
          id
        }
      });

      if (!provider) {
        throw new HttpException(
          'no existe el proveedor',
          HttpStatus.BAD_REQUEST
        );
      }

      return provider;
    } catch (error) {
      next('error al buscar proveedores', error);
    }
  }

  async findAll() {
    try {
      const providers = await this.prisma.proveedor.findMany();

      if (providers.length <= 0) {
        throw new HttpException('no hay proveedores', HttpStatus.BAD_REQUEST);
      }

      return providers;
    } catch (error) {
      next('error al buscar proveedores', error);
    }
  }

  async update(id: number, updateProviderDto: UpdateProviderDto) {
    try {
      await this.findOne(id);
      await this.prisma.proveedor.update({
        where: {
          id: id
        },
        data: {
          nombre: updateProviderDto.nombre,
          telefono: updateProviderDto.telefono,
          rif: updateProviderDto.rif,
          direccion: updateProviderDto.direccion,
          email: updateProviderDto.email
        }
      });

      return {
        msg: 'producto actualizado'
      };
    } catch (error) {
      next('error actualizando el proveedor', error);
    }
  }
}
