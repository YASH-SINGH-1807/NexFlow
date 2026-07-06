import { useQuery } from "@tanstack/react-query";

import { getJobs } from "../api/jobApi";

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,

    refetchInterval: (query) => {
      const jobs = query.state.data;

      const hasActiveJobs = jobs?.some(
        (job) =>
          job.status === "queued" ||
          job.status === "running"
      );

      return hasActiveJobs ? 1000 : false;
    },
  });
}