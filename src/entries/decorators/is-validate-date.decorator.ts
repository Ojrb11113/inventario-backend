import { registerDecorator, ValidationOptions } from 'class-validator';

export const IsValidateDate = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidateDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const now = new Date();
          return value > now;
        },
        defaultMessage() {
          return 'The date must be greater than today';
        }
      }
    });
  };
};
