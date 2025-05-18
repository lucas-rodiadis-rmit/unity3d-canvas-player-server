CREATE TABLE user_token (
	token BLOB PRIMARY KEY,
	user_id NOT NULL,
	FOREIGN KEY (user_id) REFERENCES instructor(user_id)
) WITHOUT ROWID;
