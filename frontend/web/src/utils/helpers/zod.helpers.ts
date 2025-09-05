import { z } from 'zod';

export const apiActionData = z.object({
  apiAction: z.enum(['delete', 'disconnect']).optional().nullable().nullable(),
});

export const apiActionData2 = {
  apiAction: z.enum(['delete', 'disconnect']).optional().nullable().nullable(),
};

export const apiDisconnectAction = z.object({
  apiAction: z.enum(['disconnect']).optional().nullable().nullable(),
});

export const apiRelationAction = z.object({
  apiAction: z.enum(['delete', 'disconnect', 'update']).optional().nullable().nullable(),
});
