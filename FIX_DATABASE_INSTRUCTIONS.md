# Database Fix Instructions

## Problem
The database table `games` still has the `price` column and is missing the `gameUrl` column.

## Solution
You need to manually run SQL commands to fix the database schema.

## Steps

### Option 1: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your database
3. Open the file: `migrations/fix_games_table_final.sql`
4. Execute the SQL commands
5. Restart your backend server

### Option 2: Using Command Line
1. Open Command Prompt or PowerShell
2. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```
3. Run these commands:
   ```sql
   USE game_app_db;
   
   ALTER TABLE games 
   ADD COLUMN IF NOT EXISTS gameUrl VARCHAR(500) NULL AFTER thumbnail;
   
   ALTER TABLE games 
   DROP COLUMN IF EXISTS price;
   
   DESCRIBE games;
   ```
4. Exit MySQL: `exit`
5. Restart your backend server

## Verify
After running the SQL commands, you should see:
- `gameUrl` column in the games table
- NO `price` column in the games table

## Then Restart Backend
```bash
cd game_web_backend
npm start
```

## Test
After restarting, test these endpoints:
- http://localhost:8000/api/categories/admin/all
- http://localhost:8000/api/games

Both should work without errors.
