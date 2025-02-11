import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShoppingDto } from './dto/create-shopping.dto';
import { next } from 'src/common/utils/handleError.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ShoppingService {
  constructor(private prisma: PrismaService) {}

  async create(createShoppingDto: CreateShoppingDto, userId: number) {
    try {
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

        const createShopping = await prisma.compras.create({
          data: {
            usuario_id: userId,
            tasa_cambio: createShoppingDto.exchangeRate
          }
        });

        const orderProducts = await this.createArrayPrices(
          createShoppingDto,
          prisma
        );

        const dataEntry = createShoppingDto.products.map((product, index) => {
          return {
            compra_id: createShopping.id,
            producto_id: product.productId,
            cantidad: product.quantity,
            precio: orderProducts[index].price
          };
        });

        const promiseArray = createShoppingDto.products.map(
          (product, index) => {
            if (orderProducts[index].stock < product.quantity) {
              throw new HttpException(
                `el producto (${orderProducts[index].nombre}) no tiene stock`,
                HttpStatus.BAD_REQUEST
              );
            } else {
              return prisma.producto.update({
                where: {
                  id: product.productId
                },
                data: {
                  stock: {
                    decrement: product.quantity
                  }
                }
              });
            }
          }
        );

        await prisma.compras_detalle.createMany({
          data: dataEntry
        });

        await Promise.all(promiseArray);

        return {
          msg: 'compra exitosa'
        };
      });
    } catch (error) {
      next('error creando la compra', error);
    }
  }

  async createArrayPrices(
    createShoppingDto: CreateShoppingDto,
    prisma: Prisma.TransactionClient | PrismaService
  ) {
    const productsIds = createShoppingDto.products.map(
      (product) => product.productId
    );

    const products = await prisma.producto.findMany({
      where: {
        id: {
          in: productsIds
        }
      }
    });

    if (products.length < productsIds.length) {
      throw new HttpException(
        'algun producto no existe',
        HttpStatus.BAD_REQUEST
      );
    }

    const orderProduct = createShoppingDto.products.map((product) => {
      return products.find((item) => item.id === product.productId);
    });

    return orderProduct;
  }
}
