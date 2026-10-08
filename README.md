# Brazen Hub

Brazen Blaze statistics for all your needs!

## Features

- Historical weekly challenge leaderboards
- Target challenge leaderboards (Aggregated from weekly challenge results)
- Round team matches leaderboards
- Player search
- Character stats

## Setup

Make sure to install the dependencies with [pnpm](https://pnpm.io).

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Check out the [deployment documentation](https://hub.nuxt.com/docs/getting-started/deploy) for more information.

## Deploy

Deploy the application on the Edge with [NuxtHub](https://hub.nuxt.com) on your Cloudflare account:

```bash
npx nuxthub deploy
```

Then checkout your server logs, analaytics and more in the [NuxtHub Admin](https://admin.hub.nuxt.com).

You can also deploy using [Cloudflare Pages CI](https://hub.nuxt.com/docs/getting-started/deploy#cloudflare-pages-ci).

## Stats queries

### Most healed

```sql
SELECT u.name, stats.healing_received 
FROM (
    SELECT tu.user_id, SUM(tu.healing_received) as healing_received 
    FROM team_user tu 
    WHERE tu.healing_received > 0 
    GROUP BY tu.user_id
) as stats 
LEFT JOIN user u ON u.id = stats.user_id 
ORDER BY stats.healing_received DESC
```

### KDR ranking

```sql
SELECT u.name, printf("%.2f", CAST(stats.kills as FLOAT)/CAST(stats.deaths as FLOAT)) as KDR, stats.matches
FROM (
    SELECT tu.user_id, SUM(tu.healing_received) as healing_received, SUM(tu.kills) as kills, SUM(tu.deaths) as deaths, COUNT(*) as matches
    FROM team_user tu 
    GROUP BY tu.user_id
) as stats 
LEFT JOIN user u ON u.id = stats.user_id 
WHERE stats.matches >= 10
ORDER BY CAST(stats.kills as FLOAT)/CAST(stats.deaths as FLOAT) DESC
```

### KDR Ranking based on last 30 days of matches:

```sql
SELECT u.name, printf("%.2f", CAST(stats.kills as FLOAT)/CAST(stats.deaths as FLOAT)) as KDR, stats.matches
FROM (
    SELECT tu.user_id, SUM(tu.healing_received) as healing_received, SUM(tu.kills) as kills, SUM(tu.deaths) as deaths, COUNT(*) as matches
    FROM team_user tu 
  	WHERE tu.created_at > strftime('%s', 'now', '-30 days')
    GROUP BY tu.user_id
) as stats 
LEFT JOIN user u ON u.id = stats.user_id 
WHERE stats.matches >= 10
ORDER BY CAST(stats.kills as FLOAT)/CAST(stats.deaths as FLOAT) DESC;
```