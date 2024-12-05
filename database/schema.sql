CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    migration VARCHAR NOT NULL,
    batch INTEGER NOT NULL
);

-- SQLite-specific table, not needed in PostgreSQL
-- CREATE TABLE sqlite_sequence(name TEXT, seq INTEGER);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    email_verified_at TIMESTAMPTZ,
    password VARCHAR NOT NULL,
    remember_token VARCHAR,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    balance NUMERIC NOT NULL DEFAULT 1000
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email VARCHAR NOT NULL,
    token VARCHAR NOT NULL,
    created_at TIMESTAMPTZ,
    PRIMARY KEY (email)
);

CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR NOT NULL PRIMARY KEY,
    user_id INTEGER,
    ip_address VARCHAR,
    user_agent TEXT,
    payload TEXT NOT NULL,
    last_activity TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_user_id_index ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_last_activity_index ON sessions (last_activity);

CREATE TABLE IF NOT EXISTS cache (
    key VARCHAR NOT NULL PRIMARY KEY,
    value TEXT NOT NULL,
    expiration INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS cache_locks (
    key VARCHAR NOT NULL PRIMARY KEY,
    owner VARCHAR NOT NULL,
    expiration INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    queue VARCHAR NOT NULL,
    payload TEXT NOT NULL,
    attempts INTEGER NOT NULL,
    reserved_at TIMESTAMPTZ,
    available_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS jobs_queue_index ON jobs (queue);

CREATE TABLE IF NOT EXISTS job_batches (
    id VARCHAR NOT NULL PRIMARY KEY,
    name VARCHAR NOT NULL,
    total_jobs INTEGER NOT NULL,
    pending_jobs INTEGER NOT NULL,
    failed_jobs INTEGER NOT NULL,
    failed_job_ids TEXT NOT NULL,
    options TEXT,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS failed_jobs (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR NOT NULL UNIQUE,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sorteio (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    participants TEXT,
    winner VARCHAR,
    finished BOOLEAN NOT NULL DEFAULT FALSE,
    date TIMESTAMPTZ NOT NULL DEFAULT '2024-07-06 19:46:02',
    total_numbers INTEGER NOT NULL DEFAULT 0,
    end_date TIMESTAMPTZ,
    prize NUMERIC,
    hash VARCHAR,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    winner_number INTEGER
);