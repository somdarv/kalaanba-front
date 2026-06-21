# Identity engine events

Event schemas emitted by the Identity engine. All events flow through the
shared `outbox` table (Constitution Law 6 / Identity engine doc §11).

| Event | Trigger | Notes |
| --- | --- | --- |
| `identity.user_registered` | POST /api/v1/auth/registration succeeds | Channel-tagged |
| `identity.user_claimed` | PENDING_CLAIM → CLAIMED transition (email-verify confirm) | Phone signups skip this |
| `identity.user_channel_bound` | A second channel is added to an existing user | Distinct from `user_claimed` |

Consumers: Analytics, Notification.
