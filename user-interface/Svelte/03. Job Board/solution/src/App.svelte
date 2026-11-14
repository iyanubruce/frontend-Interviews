<script>
  import JobPosting from './JobPosting.svelte';
  const PAGE_SIZE = 6;
  let jobIdsCache = null;

  async function fetchJobIds(currPage) {
    let jobs = jobIdsCache;
    if (!jobs) {
      const res = await fetch(
        'https://hacker-news.firebaseio.com/v0/jobstories.json',
      );
      jobIdsCache = jobs = await res.json();
    }
    const start = currPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return jobs.slice(start, end);
  }

  async function fetchJobs(currPage) {
    const jobIdsForPage = await fetchJobIds(currPage);
    const jobsForPage = await Promise.all(
      jobIdsForPage.map((jobId) =>
        fetch(
          `https://hacker-news.firebaseio.com/v0/item/${jobId}.json`,
        ).then((res) => res.json()),
      ),
    );
    return jobsForPage;
  }

  let jobPagePromises = [fetchJobs(0)];

  function loadMoreJobs() {
    jobPagePromises = [
      ...jobPagePromises,
      fetchJobs(jobPagePromises.length),
    ];
  }
</script>

<div class="app">
  <h1 class="title">Hacker News Jobs Board</h1>

  <div>
    <div class="jobs" role="list">
      {#each jobPagePromises as jobsPromise}
        {#await jobsPromise then jobs}
          {#each jobs as job}
            <JobPosting {...job} />
          {/each}
        {/await}
      {/each}
    </div>

    {#await jobPagePromises[jobPagePromises.length - 1]}
      {#if jobPagePromises.length === 1}
        <p class="loading">Loading...</p>
      {:else}
        <button class="load-more-button" disabled>
          Loading...
        </button>
      {/if}
    {:then}
      {#if jobPagePromises.length * PAGE_SIZE < jobIdsCache.length}
        <button class="load-more-button" on:click={loadMoreJobs}>
          Load more jobs
        </button>
      {/if}
    {/await}
  </div>
</div>

<style>
  .app {
    max-width: 600px;
    margin: 0 auto;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    color: #ff6600;
    margin-bottom: 24px;
  }

  .jobs {
    display: grid;
    row-gap: 16px;
  }
  .loading {
    color: #4d4d4d;
    font-weight: bold;
    font-size: 18px;
  }

  .load-more-button {
    background-color: #ff6600;
    border: none;
    border-radius: 4px;
    color: #fff;
    margin-top: 20px;
    padding: 8px 12px;
  }

  .load-more-button:not(:disabled) {
    cursor: pointer;
  }

  .load-more-button:hover {
    background-color: #e65c00;
  }
</style>
