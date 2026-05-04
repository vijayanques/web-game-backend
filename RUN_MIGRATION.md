# How to Add last_login_at Column to Database

## Method 1: Run Migration Script (Easiest)

1. Open terminal in `game_web_backend` folder
2. Run the migration:
   ```bash
   node src/migrations/add-last-login-at.js
   ```

This will automatically add the column to your database.

## Method 2: Run SQL Directly

1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or terminal)
2. Connect to your database
3. Run this SQL:
   ```sql
   ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL DEFAULT NULL AFTER level;
   ```

## Method 3: Use MySQL Command Line

```bash
mysql -u your_username -p your_database_name -e "ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL DEFAULT NULL AFTER level;"
```

## Verify the Column Was Added

Run this SQL to check:
```sql
DESCRIBE users;
```

You should see `last_login_at` in the column list.

## After Adding the Column

1. Restart your backend server
2. Test login - the `last_login_at` should now update
3. Check admin panel - user status should now work correctly
