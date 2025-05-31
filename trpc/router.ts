import { router } from './init';
import { exampleRouter } from './routers/example';
import { solarDataRouter } from './routers/sunspec';

export const appRouter = router({
  example: exampleRouter,
  sunspec: solarDataRouter,
});

export type AppRouter = typeof appRouter;
