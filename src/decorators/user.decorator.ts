import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserPrisma } from '@prisma/client';

type TypeData = keyof UserPrisma;

export const User = createParamDecorator(
  (data: TypeData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
