export type Job = {
  id: number;
  url?: string;
  by: string;
  time: number;
  title: string;
};

export default function JobPosting({ url, by, time, title }: Readonly<Job>) {
  return (
    <div className="post" role="listitem">
      <h2 className="post__title">
        {url ? (
          <a href={url} target="_blank" rel="noopener">
            {title}
          </a>
        ) : (
          title
        )}
      </h2>
      <p className="post__metadata">
        By {by} &middot; {new Date(time * 1000).toLocaleString()}
      </p>
    </div>
  );
}
