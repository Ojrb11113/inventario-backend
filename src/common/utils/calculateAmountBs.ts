import { Decimal } from '@prisma/client/runtime/library';

export const calculateAmountBs = (
  amount: number | Decimal,
  exchangeRate: number | Decimal
) => {
  const multiplication = Number(amount) * Number(exchangeRate);
  return multiplication.toFixed(2);
};
