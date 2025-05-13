CREATE TABLE instructor (
    user_id TEXT PRIMARY KEY,
    email TEXT
) WITHOUT ROWID;

CREATE TABLE unity_project (
    user_id TEXT,
    uploaded DATE,
    FOREIGN KEY (user_id) REFERENCES instructor (user_id),
    PRIMARY KEY (user_id)
) WITHOUT ROWID;

CREATE TABLE unity_project_file (
    filepath TEXT PRIMARY KEY,
    filesize INTEGER,
    uploaded DATE
) WITHOUT ROWID;

CREATE TABLE embed_instance (
    user_id TEXT,
    course_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES instructor (user_id),
    PRIMARY KEY (user_id, course_id)
) WITHOUT ROWID;
