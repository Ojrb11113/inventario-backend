import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEntryDto } from './dto/create-entry.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { next } from 'src/common/utils/handleError.util';
import { formatDate } from 'src/common/utils/formatDate';

@Injectable()
export class EntriesService {
  constructor(private prisma: PrismaService) {}

  async create(createEntryDto: CreateEntryDto, userId: number) {
    try {
      console.log({ userId });
      return await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.usuario.findUnique({
          where: {
            id: userId
          }
        });

        if (!user) {
          throw new HttpException(
            'el usuario no existe',
            HttpStatus.BAD_REQUEST
          );
        }

        const createEntry = await prisma.entrada.create({
          data: {
            usuario_id: userId
          }
        });

        const dataEntry = createEntryDto.products.map((product) => {
          return {
            entrada_id: createEntry.id,
            producto_id: product.productId,
            cantidad: product.quantity,
            fecha_vencimiento: product.expirationDate
          };
        });

        const promiseArray = createEntryDto.products.map((product) => {
          return prisma.producto.update({
            where: {
              id: product.productId
            },
            data: {
              stock: {
                increment: product.quantity
              }
            }
          });
        });

        await prisma.entrada_detalle.createMany({
          data: dataEntry
        });

        await Promise.all(promiseArray);

        return {
          msg: 'entrada creada'
        };
      });
    } catch (error) {
      next('error creando la entrada', error);
    }
  }

  async findAllEntryProduct(productId: number) {
    try {
      const entries = await this.prisma.entrada.findMany({
        where: {
          entrada_detalle: {
            some: {
              producto_id: productId
            }
          }
        },
        include: {
          entrada_detalle: {
            where: {
              producto_id: productId
            },
            select: {
              cantidad: true,
              fecha_vencimiento: true,
              producto: {
                select: {
                  id: true
                }
              }
            }
          },
          usuario: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      if (entries.length <= 0) {
        throw new HttpException(
          'no hay lotes con este id',
          HttpStatus.NOT_FOUND
        );
      }

      const formatData = entries.map((entry) => {
        return {
          entryDate: formatDate(entry.fecha),
          expirationDate: formatDate(
            entry.entrada_detalle[0].fecha_vencimiento
          ),
          quantity: entry.entrada_detalle[0].cantidad,
          userName: entry.usuario.name
        };
      });

      return formatData;
    } catch (error) {
      next('error buscando lotes', error);
    }
  }
}
