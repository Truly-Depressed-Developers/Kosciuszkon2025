import { trpc } from '@/trpc/server';

export default async function ExampleServerComponent() {
  const exampleData = await trpc.example.getExampleDataWithInput('server component');
  const userData = await trpc.example.getExampleUserData();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3>Example server component</h3>
        <span>{exampleData}</span>
      </div>
      <div>
        <h3>User data</h3>
        <span>{userData.isAnonymous ? 'Anonymous user authenticated' : userData.email}</span>
      </div>
    </div>
  );
}
