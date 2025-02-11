import { cargos } from '@prisma/client';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  telf: string;

  @IsNotEmpty()
  @IsString()
  ci: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Cajero', 'Panadero'], {
    message: 'el cargo debe ser Cajero o Panadero'
  })
  cargo: cargos;
}
