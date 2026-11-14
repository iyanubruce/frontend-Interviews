# Job Board

**Difficulty:** Medium · **Duration:** ~30 min · **Topics:** Networking

> Source: [job-board](https://www.greatfrontend.com/questions/user-interface/job-board/vanilla)

## Description

Build a job board that displays the latest job postings fetched from the Hacker News API, with each posting displaying the job title, poster, and date posted.

![Job board example](https://www.gfecdn.net/img/questions/job-board/job-board-example.webp)

### Requirements

- Show "Loading..." until the job ID request completes.
- The page should show 6 jobs on initial load with a button to load more postings.
- Clicking the "Load more" button loads the next page of 6 postings and is disabled while those job details are being fetched.
- The button does not appear if there aren't any more postings to load. After a full or partial final page, hide it without issuing an empty details request.
- If there's a `url` field returned for the job details, make the job title a link that opens the job details page in a new window when clicked.
- Job links and the "Load more" button should be operable with a keyboard.
- The timestamp can be formatted in any way you like.

### API

Hacker News has a public API to fetch jobs by Y Combinator companies. There's no single API that fetches a list of jobs together with the data, so you will have to make separate requests to fetch the necessary data and combine them to be displayed.

#### Job stories

Fetches a list of job posting IDs.

- URL: [https://hacker-news.firebaseio.com/v0/jobstories.json](https://hacker-news.firebaseio.com/v0/jobstories.json)
- HTTP Method: `GET`
- Content Type: `json`

Sample response:

```js
[35908337, 35904973, 35900922, 35893439, 35890114, 35880345, ...]
```

#### Job details

Fetches job posting details given an ID.

- URL: `https://hacker-news.firebaseio.com/v0/item/{id}.json`
- HTTP Method: `GET`
- Content Type: `json`

Sample response for [https://hacker-news.firebaseio.com/v0/item/35908337.json](https://hacker-news.firebaseio.com/v0/item/35908337.json):

```json
{
  "by": "jamilbk",
  "id": 35908337,
  "score": 1,
  "time": 1683838872,
  "title": "Firezone (YC W22) is hiring Elixir and Rust engineers",
  "type": "job",
  "url": "https://www.ycombinator.com/companies/firezone/jobs"
}
```

The API returns `time` as a Unix timestamp in seconds. JavaScript's `Date` constructor and Angular's `DatePipe` interpret numeric timestamps as milliseconds, so multiply `time` by 1,000 before formatting it.

### Notes

- The focus of this question is on functionality and not on styling, but feel free to beautify the page.

## Project structure

```
├── src
│   ├── index.js
│   └── styles.css
├── index.html
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Microsoft
- Tiktok
- Atlassian
- Openai
- Stripe
- Coinbase
- Rippling
