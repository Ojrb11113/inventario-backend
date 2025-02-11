import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { next } from 'src/common/utils/handleError.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { SumInterface } from './interfaces/sum.interface';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.prisma.producto.findFirst({
        where: {
          nombre: createProductDto.name
        }
      });

      if (product) {
        throw new HttpException(
          'ya hay un producto con el mismo nombre en la DB',
          HttpStatus.BAD_REQUEST
        );
      }

      const proveedor = await this.prisma.proveedor.findFirst({
        where: {
          id: createProductDto.providerId
        }
      });

      if (!proveedor) {
        throw new HttpException(
          'el id del proveedor no existe en la DB',
          HttpStatus.BAD_REQUEST
        );
      }

      await this.prisma.producto.create({
        data: {
          nombre: createProductDto.name,
          stock: createProductDto.stock,
          price: createProductDto.price,
          proveedor_id: createProductDto.providerId
        }
      });

      return {
        msg: 'producto creado'
      };
    } catch (error) {
      next('Error creando el producto', error);
    }
  }

  async findAll() {
    try {
      const products = await this.prisma.producto.findMany({
        include: {
          proveedor: true
        }
      });

      return products;
    } catch (error) {
      next('Error buscando productos', error);
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.prisma.producto.findUnique({
        where: {
          id
        },
        include: {
          proveedor: true
        }
      });

      return product;
    } catch (error) {
      next('error buscando el producto', error);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.findOne(id);

      if (!product) {
        throw new HttpException(
          'el producto no existe',
          HttpStatus.BAD_REQUEST
        );
      }

      await this.prisma.producto.update({
        where: {
          id
        },
        data: {
          nombre: updateProductDto.name,
          stock: updateProductDto.stock,
          price: updateProductDto.price,
          proveedor_id: updateProductDto.providerId
        }
      });

      return {
        msg: 'producto editado'
      };
    } catch (error) {
      next('error actualizando el producto', error);
    }
  }

  async findBestSellerAndLeastSold() {
    try {
      const [bestSellersSum, leastSoldSum] = await Promise.all([
        this.prisma.compras_detalle.groupBy({
          by: 'producto_id',
          _sum: {
            cantidad: true
          },
          orderBy: {
            _sum: {
              cantidad: 'desc'
            }
          },
          take: 5
        }),

        this.prisma.compras_detalle.groupBy({
          by: 'producto_id',
          _sum: {
            cantidad: true
          },
          orderBy: {
            _sum: {
              cantidad: 'asc'
            }
          },
          take: 5
        })
      ]);

      const [bestSellers, leastSold] = await Promise.all([
        this.formatDataSum(bestSellersSum),
        this.formatDataSum(leastSoldSum)
      ]);

      return {
        bestSellers,
        leastSold
      };
    } catch (error) {
      next('error buscando productos', error);
    }
  }

  async formatDataSum(sum: SumInterface[]) {
    const productsIds = sum.map((sum) => sum.producto_id);
    const products = await this.prisma.producto.findMany({
      where: {
        id: {
          in: productsIds
        }
      },
      select: {
        id: true,
        nombre: true
      }
    });

    const productsName = productsIds.map((id) => {
      return products.find((product) => product.id === id);
    });

    const responseData = productsName.map((product, index) => {
      return {
        productName: product.nombre,
        shoppingProduct: sum[index]._sum.cantidad
      };
    });

    return responseData;
  }

  async findDeficitStock() {
    try {
      const products = await this.prisma.producto.findMany({
        where: {
          stock: {
            lte: 20
          }
        }
      });

      if (products.length <= 0) {
        throw new HttpException(
          'no hay productos con stock bajo',
          HttpStatus.NOT_FOUND
        );
      }

      return products;
    } catch (error) {
      next('error buscando productos', error);
    }
  }

  async getMetrics() {
    try {
      const [quantityProducts, quantityDeficit] = await Promise.all([
        this.prisma.producto.count(),
        this.prisma.producto.count({
          where: {
            stock: {
              lte: 20
            }
          }
        })
      ]);

      return {
        quantityProducts,
        quantityDeficit
      };
    } catch (error) {
      throw new HttpException('error buscando metricas', error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
