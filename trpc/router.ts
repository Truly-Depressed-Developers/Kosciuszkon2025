import { router } from './init';
import { deviceManagementRouter } from './routers/deviceManagement';
import { exampleRouter } from './routers/example';

export const appRouter = router({
  example: exampleRouter,
  device: deviceManagementRouter,
});

export type AppRouter = typeof appRouter;
