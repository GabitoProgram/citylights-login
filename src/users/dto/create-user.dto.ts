import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  firstName: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  lastName: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser USER_CASUAL, USER_ADMIN o SUPER_USER' })
  role?: UserRole;
}

export class CreateAdminUserDto {
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  firstName: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  lastName: string;
}

export class CreateSuperUserDto {
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  firstName: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  lastName: string;
}