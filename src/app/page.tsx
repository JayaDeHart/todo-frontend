import CreateTaskButton from "./components/createTaskButton";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Tasks from "./components/tasks";
import { getTasks } from "./_api/tasks";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  return (
    <div className="flex flex-col items-center font-medium w-1/2 mx-auto">
      <CreateTaskButton />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Tasks />
      </HydrationBoundary>
    </div>
  );
}
