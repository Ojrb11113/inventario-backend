import { PaginationDto } from '../dto/pagination.dto';

export const calculateOffset = (paginationDto: PaginationDto) => {
  const { limit = 10, page = 1 } = paginationDto;
  const offset = (page - 1) * limit;
  return {
    offset,
    limit
  };
};
