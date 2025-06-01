import { router } from './init';
import { deviceManagementRouter } from './routers/deviceManagement';
import { exampleRouter } from './routers/example';
import { gatewayReadingManagementRouter } from './routers/gatewayReadingManagement';
import { solarDataRouter } from './routers/sunspec';

export const appRouter = router({
  example: exampleRouter,
  sunspec: solarDataRouter,
  device: deviceManagementRouter,
  gatewayReading: gatewayReadingManagementRouter,
});

export type AppRouter = typeof appRouter;
