# Migrating to PostgreSQL for Production

## Why PostgreSQL?

The current SQLite database resets on each serverless deployment because Vercel's `/tmp` directory is ephemeral. For production, you should use a persistent PostgreSQL database.

## Recommended Free PostgreSQL Services

### Option 1: Neon (Recommended)
- **Website**: https://neon.tech
- **Free Tier**: 10 GB storage, 100 hours compute/month
- **Features**: Serverless PostgreSQL, auto-scaling, instant branching

### Option 2: Supabase
- **Website**: https://supabase.com
- **Free Tier**: 500 MB database, unlimited API requests
- **Features**: PostgreSQL + Auth + Storage

### Option 3: PlanetScale
- **Website**: https://planetscale.com
- **Free Tier**: 5 GB storage, 1 billion row reads/month
- **Features**: MySQL-compatible (requires minor code changes)

## Migration Steps (Using Neon)

### 1. Create Neon Database

1. Go to https://neon.tech and sign up
2. Create a new project
3. Copy your connection string (looks like):
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### 2. Update backend/database.py

```python
import os
from sqlalchemy import create_engine

# Use PostgreSQL for production, SQLite for local development
if os.environ.get('DATABASE_URL'):
    # Production - PostgreSQL
    SQLALCHEMY_DATABASE_URL = os.environ.get('DATABASE_URL')
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
else:
    # Local development - SQLite
    SQLALCHEMY_DATABASE_URL = "sqlite:///./manufacturing.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
```

### 3. Add Environment Variable to Vercel

1. Go to your Vercel **backend** project
2. Settings → Environment Variables
3. Add:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon connection string
   - **Environment**: Production
4. Redeploy

### 4. Update requirements.txt

Add PostgreSQL driver:
```
psycopg2-binary>=2.9.0
```

### 5. Test Migration

Deploy and test that your data persists across deployments!

## Benefits of PostgreSQL

✅ **Persistent Data** - Survives deployments
✅ **Better Performance** - Optimized for production
✅ **Concurrent Access** - Multiple users simultaneously
✅ **Advanced Features** - Full-text search, JSON support
✅ **Backups** - Automatic backups included
✅ **Scalability** - Handles growth easily

## Alternative: Keep SQLite with Persistent Storage

If you prefer SQLite, you can mount persistent storage:

### Vercel Blob Storage
- Use Vercel's Blob storage for the database file
- Requires code changes to sync database to/from blob storage
- More complex, not recommended for databases

### Better Approach
Just use PostgreSQL - it's designed for this use case!
