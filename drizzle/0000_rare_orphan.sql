CREATE TABLE `requests` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`category` text NOT NULL,
	`city` text NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`payload` text NOT NULL,
	`photo_keys` text DEFAULT '[]' NOT NULL,
	`created_at` text NOT NULL
);
