# Migration Guide

## Current Status

✅ **Migration baseline created and applied**

Your database already had tables created via `prisma db push`, and we've now created a baseline migration to track this state.

## Migration Files

- `prisma/migrations/0_init/` - Baseline migration representing the initial schema

## Using Migrations Going Forward

### For Development

When you make schema changes:

```bash
# 1. Edit prisma/schema.prisma
# 2. Create a new migration
npx prisma migrate dev --name descriptive-name

# This will:
# - Create a new migration file
# - Apply it to your database
# - Regenerate Prisma Client
```

### For Production (Vercel)

Vercel will automatically run migrations during deployment if you add this to your build command:

```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

Or use the current setup which runs `prisma generate` in postinstall and build.

### Checking Migration Status

```bash
# Check if migrations are up to date
npx prisma migrate status

# View migration history
npx prisma migrate list
```

## File Lock Issue (Windows)

If you get `EPERM: operation not permitted` when running `prisma generate`:

1. **Close all Node processes:**
   ```powershell
   Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
   ```

2. **Close VS Code/IDE** temporarily

3. **Try again:**
   ```bash
   npx prisma generate
   ```

4. **Or restart your computer** if the issue persists

## Troubleshooting

### "No migration found in prisma/migrations"

This means you need to create a baseline migration. We've already done this, so you shouldn't see this error anymore.

### "Database schema is not empty"

This happens when the database has tables but no migration files. We've resolved this by creating the baseline migration.

### "Migration already applied"

This is normal - it means the migration has been run. You can check status with `npx prisma migrate status`.

## Next Steps

1. ✅ Baseline migration created
2. ✅ Migration marked as applied
3. ✅ Database schema is in sync
4. 🚀 You can now use `prisma migrate dev` for future schema changes

