# Email submission setup

The public address remains `info@thezao.com`. Do not create or advertise a separate submission
mailbox. A filtered forward sends likely ZABAL Gamez submissions into the same canonical queue as
the website.

## Architecture

```text
person emails info@thezao.com
        |
existing mailbox receives the message
        |
mail rule matches a ZABAL Gamez submission subject or label
        |
forward to a Resend receiving address or receiving subdomain
        |
Resend email.received webhook -> /api/submission-email
        |
/api/submissions -> pending review queue
```

This design preserves the existing root-domain mailbox and avoids changing its MX records. If the
mail provider cannot forward conditionally, use a dedicated receiving subdomain behind the scenes.
The public still sees only `info@thezao.com`.

## Required configuration

1. In Resend, configure inbound receiving on a receiving subdomain or use its managed receiving
   address. Do not replace the root `thezao.com` mail routing.
2. In the existing `info@thezao.com` mailbox, add a forwarding rule for messages whose subject
   begins with `ZABAL Gamez submission:`. The website's email link pre-fills this subject.
3. Create a Resend webhook for the `email.received` event pointing to:
   `https://zabalgamez.com/api/submission-email`.
4. Set the webhook signing secret as `RESEND_WEBHOOK_SECRET`.
5. Create independent long random values for `SUBMISSION_INGEST_SECRET` and `ADMIN_KEY`.
6. Set `RESEND_API_KEY` so the adapter can retrieve message bodies and send receipts.
7. Set `SUBMISSION_INBOUND_TO` to the exact private Resend recipient or recipients, comma-separated.
   This prevents other inbound aliases in the same Resend account from entering the project queue.
8. Set `SUBMISSION_FROM_EMAIL` to a sender on a verified sending domain, for example
   `The ZAO <info@updates.thezao.com>`. Replies are always directed to `info@thezao.com`.
9. Deploy and send one test from an address outside The ZAO domain.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Retrieve received messages and send receipts or review notes. |
| `RESEND_WEBHOOK_SECRET` | Yes | Verify the Svix signature on inbound webhook requests. |
| `SUBMISSION_INGEST_SECRET` | Yes | Authenticate the internal adapter to the canonical submission endpoint. |
| `SUBMISSION_INBOUND_TO` | Recommended | Exact allowed private inbound recipient list. |
| `SUBMISSION_FROM_EMAIL` | Recommended | Verified sender for receipts and status emails. |
| `PUBLIC_SITE_URL` | Optional | Absolute origin used in private receipt links. Defaults to `https://zabalgamez.com`. |

## Acceptance check

1. Send an email with subject `ZABAL Gamez submission: Test project`.
2. Include a short description and one URL in the message.
3. Confirm one, and only one, pending project appears in `/review` with source `email`.
4. Confirm the sender receives a receipt containing a private status link.
5. Replay the webhook in Resend. Confirm it reports a duplicate and does not create a second record.
6. Request changes from `/review`. Confirm the sender receives the exact note and can update through
   the private link.
7. Approve the updated project. Confirm it appears once in `/submissions` and that private contact,
   provider IDs, and attachment metadata are absent from the public API response.

## Privacy and failure behavior

- Email entries remain pending until a human approves them.
- The adapter stores attachment names, content types, and sizes for review. It does not download or
  publish attachment bytes.
- Webhook signatures expire after five minutes and are compared in constant time.
- Resend retries are safe because source message and event IDs are hashed into an idempotency key.
- If receipts are not configured, submission storage still succeeds. If ingestion secrets or webhook
  verification are missing, the email route fails closed.
