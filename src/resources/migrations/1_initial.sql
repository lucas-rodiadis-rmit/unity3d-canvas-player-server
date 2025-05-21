BEGIN TRANSACTION;

CREATE TABLE instructor (
    user_id TEXT PRIMARY KEY,
    email TEXT
) WITHOUT ROWID;

CREATE TABLE unity_project (
    project_id TEXT,
    user_id TEXT NOT NULL,

    uploaded DATE NOT NULL,
    display_name TEXT NOT NULL,
    root_filepath TEXT NOT NULL,
    PRIMARY KEY (project_id),
    FOREIGN KEY (user_id) REFERENCES instructor (user_id)
) WITHOUT ROWID;

CREATE TABLE unity_project_file (
    project_id TEXT,
    relative_filepath TEXT,
    filesize INTEGER NOT NULL,
    uploaded DATE NOT NULL,
    PRIMARY KEY (project_id, relative_filepath),
    FOREIGN KEY (project_id) REFERENCES unity_project (project_id)
) WITHOUT ROWID;

-- CREATE TABLE embed_instance (
--     user_id TEXT,
--     course_id INTEGER,
--     FOREIGN KEY (user_id) REFERENCES instructor (user_id),
--     PRIMARY KEY (user_id, course_id)
-- ) WITHOUT ROWID;

COMMIT;
