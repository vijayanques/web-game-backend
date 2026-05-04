@echo off
echo ========================================
echo Database Fix Script
echo ========================================
echo.
echo This will add slug and gameUrl columns to games table
echo and remove price column
echo.
pause

mysql -u root -p game_app_db < FINAL_DATABASE_FIX.sql

echo.
echo ========================================
echo Database fix completed!
echo Now restart your backend server
echo ========================================
pause
