CREATE TABLE IF NOT EXISTS banned_ip (
	ip STRING(15) PRIMARY KEY NOT NULL,
	banned_date DATE NOT NULL DEFAULT CURRENT_DATE
);