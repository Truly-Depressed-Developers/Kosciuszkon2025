import { router } from './init';
import { deviceManagementRouter } from './routers/deviceManagement';
import { exampleRouter } from './routers/example';
import { solarDataRouter } from './routers/sunspec';

export const appRouter = router({
  example: exampleRouter,
  sunspec: solarDataRouter,
  device: deviceManagementRouter,
});

export type AppRouter = typeof appRouter;
