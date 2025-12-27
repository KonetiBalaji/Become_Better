# Fixing Prisma Client Generation on Windows

## The Problem

On Windows, you may encounter this error when running `npx prisma generate`:

```
EPERM: operation not permitted, rename '...query_engine-windows.dll.node.tmp...' -> '...query_engine-windows.dll.node'
```

This happens because:
- A Node.js process is locking the file (often from Cursor/VS Code or a dev server)
- Windows file locking is stricter than Linux/Mac
- The Prisma Client binary file is in use

## Quick Fix

### Option 1: Use the Fix Script

```powershell
.\fix-prisma-generate.ps1
```

This script will:
1. Stop all Node processes
2. Clean up temp files
3. Generate Prisma Client

### Option 2: Manual Steps

1. **Stop all Node processes:**
   ```powershell
   Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
   ```

2. **Close Cursor/VS Code** (or any IDE with the project open)

3. **Clean up temp files:**
   ```powershell
   Remove-Item -Path "node_modules\.prisma" -Recurse -Force -ErrorAction SilentlyContinue
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

### Option 3: Restart Your Computer

Sometimes the simplest solution is to restart Windows, which releases all file locks.

## Important Notes

### ✅ This Won't Affect Vercel

This is a **local Windows development issue only**. Vercel builds run on Linux and don't have this problem. Your deployments will work fine!

### ✅ Prisma Client May Already Be Generated

If you've run `npm install` or `npm run build` before, the Prisma Client is likely already generated. You can verify:

```powershell
Test-Path "node_modules\.prisma\client\index.js"
```

If this returns `True`, your Prisma Client is already generated and working!

### ✅ The postinstall Script Handles This

Your `package.json` has:
```json
"postinstall": "prisma generate"
```

This means Prisma Client will be generated automatically when you run `npm install`. If you get the error during `npm install`, you can:

1. Let `npm install` complete (it may show the error but continue)
2. Then manually run the fix script
3. Or just proceed - the client might already be generated

## When Do You Need to Generate?

You only need to manually run `npx prisma generate` when:
- You change `prisma/schema.prisma`
- You pull new changes that modify the schema
- The Prisma Client is missing or corrupted

Otherwise, it's generated automatically via:
- `npm install` (runs postinstall)
- `npm run build` (includes prisma generate)

## Alternative: Use WSL

If this becomes a frequent issue, consider using Windows Subsystem for Linux (WSL):
- Install WSL2
- Run your development in WSL
- No file locking issues

## Still Having Issues?

1. **Check if Prisma Client exists:**
   ```powershell
   ls node_modules\.prisma\client
   ```

2. **Try generating in a new terminal** (as Administrator)

3. **Check for antivirus** blocking file operations

4. **Use the workaround:** Since Prisma Client is generated during build, you can:
   - Skip manual generation
   - Let it generate during `npm run build`
   - Or during Vercel deployment

