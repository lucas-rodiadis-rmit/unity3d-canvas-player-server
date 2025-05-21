BEGIN TRANSACTION;

CREATE TABLE user_token (
    token BLOB PRIMARY KEY,
    user_id TEXT NOT NULL,
    return_url TEXT,
    FOREIGN KEY (user_id) REFERENCES instructor (user_id)
) WITHOUT ROWID;

COMMIT;
