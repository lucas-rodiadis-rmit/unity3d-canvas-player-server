BEGIN TRANSACTION;

ALTER TABLE unity_project ADD COLUMN embed_width INTEGER;
ALTER TABLE unity_project ADD COLUMN embed_height INTEGER;

ALTER TABLE unity_project ADD COLUMN allow_resizing INTEGER NOT NULL DEFAULT 1;
ALTER TABLE unity_project ADD COLUMN allow_fullscreen INTEGER NOT NULL DEFAULT 1;
ALTER TABLE unity_project ADD COLUMN allow_reloading INTEGER NOT NULL DEFAULT 1;

ALTER TABLE unity_project ADD COLUMN fps_counter INTEGER;

COMMIT;
