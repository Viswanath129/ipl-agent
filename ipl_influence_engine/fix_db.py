import sqlite3
import os

db_path = 'ipl_data.db'
if os.path.exists(db_path):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        print("Dropping debates table to force recreation...")
        cursor.execute("DROP TABLE IF EXISTS debates")
        conn.commit()
        print("Table dropped.")
        conn.close()
    except Exception as e:
        print(f"Error fixing database: {e}")
else:
    print(f"Database file {db_path} not found.")
