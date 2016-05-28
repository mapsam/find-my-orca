# Find My Orca

A Node.js & ExpressJS application to help humans reconnect with their [ORCA](https://orcacard.com) cards in the Seattle & Puget Sound area.

### Configure

Environment variables

```bash
AWS_DEFAULT_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
DYNAMODB_TABLE_NAME
EMAIL_USER # a gmail account
EMAIL_PASSWORD # password for gmail account
```

### Test

Requires the environment variables to be configured for a test account:

```bash
AWS_ENDPOINT # localhost endpoint for dynalite, defaults to https://dynamodb.us-west-2.amazonaws.com in production
```

```bash
npm test
```

### Deploy

TBD