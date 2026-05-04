# Railway MySQL Setup Guide

## What I Fixed

The backend was looking for `DB_HOST`, `DB_USER`, etc., but Railway MySQL provides different variable names:
- `MYSQLHOST`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`
- `MYSQLPORT`

I updated `src/config/database.js` to check for BOTH Railway variables AND local development variables.

## How to Verify Railway MySQL is Connected

### Step 1: Check Railway Dashboard

1. Go to your Railway project
2. Click on your backend service
3. Go to "Variables" tab
4. You should see these variables automatically added by Railway:
   - `MYSQLHOST` (e.g., `monorail.proxy.rlwy.net`)
   - `MYSQLUSER` (e.g., `root`)
   - `MYSQLPASSWORD` (a long random string)
   - `MYSQLDATABASE` (e.g., `railway`)
   - `MYSQLPORT` (e.g., `12345`)

### Step 2: Check Deployment Logs

After deploying, check the logs. You should see:

```
🔧 Initializing Sequelize...
🚨 ENV CHECK: {
  host: 'monorail.proxy.rlwy.net',
  user: 'root',
  db: 'railway',
  port: 12345,
  hasPassword: true
}
✅ Sequelize instance created
✅ Database connection established successfully
```

### Step 3: If Variables Are Still Undefined

If you still see `undefined` values, it means Railway hasn't linked the MySQL database to your backend service:

1. Go to Railway Dashboard
2. Click on your MySQL database
3. Look for "Connected Services" section
4. Make sure your backend service is listed
5. If not, click "Connect" and select your backend service

### Step 4: Redeploy

After connecting the MySQL database:
1. Go to your backend service
2. Click "Deploy" → "Redeploy"
3. Check the logs again

## Expected Behavior

Once properly configured, you should see:
- ✅ All environment variables populated
- ✅ Database connection established
- ✅ Models synchronized
- ✅ Server running without errors

## Troubleshooting

### Error: "All environment variables are undefined"
- MySQL database is not connected to the backend service
- Solution: Connect them in Railway Dashboard

### Error: "Access denied for user"
- Wrong credentials
- Solution: Railway should auto-configure this. Try recreating the MySQL database.

### Error: "Unknown database"
- Database name mismatch
- Solution: Check `MYSQLDATABASE` variable matches the actual database name

## Local Development

For local development, create a `.env` file with:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=game_app_db
DB_USER=root
DB_PASSWORD=your_mysql_password
```

The code will automatically use these variables when Railway variables are not available.
