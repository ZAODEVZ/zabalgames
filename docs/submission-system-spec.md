# ZABAL Gamez submission system

This document describes the canonical Season 1 project pipeline. The public contact is
`info@thezao.com`. Email is an alternate front door into the same queue, not a second system.

## Product rules

1. Anyone can submit a project or work in progress.
2. An account, wallet, Farcaster profile, GitHub account, and prior registration are optional.
3. A project name plus either a description or a public link is enough to start.
4. Web submissions and forwarded email submissions create the same `kind: "project"` record.
5. Contact details, edit tokens, provider IDs, and attachment metadata are never returned in a
   public project feed.
6. Project details become public only after approval. A work in progress is intentionally public
   when its creator selects the building state.
7. Every creator receives a private edit token. The token supports status checks, updates,
   reviewer feedback, and resubmission without an account.
8. Editing an approved project sends it back to review. This prevents a safe approved link from
   being replaced after moderation.
9. Missing values render as pending or empty. Clients must not invent builders, scores, links,
   counts, or project details.

## User flow

```text
/submit or info@thezao.com
             |
             v
POST /api/submissions  <---  POST /api/submission-email
             |
             v
      one project record
             |
       pending review
        /           \
request changes    approve
      |                |
private status       public gallery
and edit link       /submissions
```

The submission receipt links to `/submission-status?id=<id>&token=<editToken>`. The page carries
`noindex`, `nofollow`, and a no-referrer policy. Anyone with the full link can edit the record, so
the UI tells the creator to keep it private.

## Canonical project record

Stored at `zabal:sub:v1:<id>` in Upstash Redis:

```json
{
  "id": "123",
  "kind": "project",
  "promptId": "project",
  "project": "Project name",
  "answer": "Plain-language description",
  "fields": {
    "project": "Project name",
    "description": "Plain-language description",
    "builderName": "Optional person or team",
    "track": "artist | builder | creator | empty",
    "stage": "building | ready",
    "demoUrl": "optional https URL",
    "repoUrl": "optional https URL",
    "mediaUrl": "optional https URL",
    "thumbnailUrl": "optional https URL",
    "helpWanted": "optional collaboration request",
    "progressUpdate": "optional latest update"
  },
  "email": "private optional contact",
  "handle": "optional Farcaster handle",
  "fid": "optional verified Farcaster identity",
  "status": "draft | pending | changes_requested | approved | rejected",
  "source": "web | email | ingest",
  "editToken": "private random token",
  "ts": 0,
  "updatedTs": 0
}
```

Email records can also store private source message identifiers and safe attachment metadata for
operator review. The public serializer uses an allowlist and never exposes those fields.

## Data indexes

- `zabal:subs:recent`: all submission IDs by created timestamp.
- `zabal:subs:drafts`: public work-in-progress project IDs by timestamp.
- `zabal:subs:approved`: approved project IDs by timestamp.
- `zabal:subs:bystatus:<status>`: IDs grouped by review state.
- `zabal:subs:source:<sha256>`: email or import idempotency key to prevent webhook duplicates.
- `data/builder-submissions.json`: audited repository-backed Season 1 roster.

`GET /api/submissions?feed=projects` is the only public gallery contract. It combines approved
dynamic projects, public work in progress, and the audited roster, then de-duplicates by project
URL or builder and project name. `/submissions` and downstream consumers should use this feed.
Approved dynamic projects also resolve at `/submissions/<id>` through the public single-record API.

## Endpoints

### `POST /api/submissions`

Create a project:

```json
{
  "kind": "project",
  "project": "Name",
  "answer": "Description",
  "email": "optional@example.com",
  "draft": false,
  "consent": true,
  "source": "web",
  "fields": {}
}
```

The response is `{ ok, id, status, editToken }`. Public requests use a soft IP rate limit. Trusted
email and import adapters use `Authorization: Bearer <SUBMISSION_INGEST_SECRET>`.

Creator update:

```json
{
  "action": "update",
  "id": "123",
  "editToken": "private token",
  "answer": "Updated description",
  "fields": {},
  "ready": true
}
```

Admin review uses `Authorization: Bearer <ADMIN_KEY>` and one of `approve`, `request_changes`, or
`reject`. `request_changes` should include a specific `reviewNote`.

### `GET /api/submissions`

- `?feed=projects`: canonical public project gallery.
- `?feed=builders`: audited roster only, retained for compatible clients.
- `?feed=drafts`: public work in progress.
- `?feed=recent`: approved dynamic submissions.
- `?id=<id>&token=<editToken>`: private owner view.
- `?status=pending`: full internal queue, admin authentication required.

### `POST /api/submission-email`

Resend `email.received` webhook adapter. It verifies the Svix signature, retrieves the full message
and attachment list from Resend, normalizes the email, and posts it to `/api/submissions` with the
ingest secret. It does not publish or download attachments. See `docs/email-submission-setup.md`.

## Review and publishing

`/review` loads the pending queue with `ADMIN_KEY`. Operators can inspect source, private contact,
links, attachment names, and automatic repository triage. Approval publishes project details and
triggers the existing reward operations. Requesting changes sends the review note to the creator
when an email address is available.

Only a verified Farcaster FID can receive an agent token on approval. A self-entered handle is not
treated as verified identity.

## Season information

`data/season.json` is the compact machine-readable source for Season 1 dates, tracks, public contact,
stream, submission page, and project gallery. User interfaces should prefer this file when adding
new date-driven surfaces instead of introducing another hardcoded season clock.
