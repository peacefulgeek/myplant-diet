CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`title` varchar(280) NOT NULL,
	`metaDescription` varchar(320) NOT NULL DEFAULT '',
	`body` text NOT NULL,
	`tldr` text NOT NULL,
	`category` varchar(80) NOT NULL DEFAULT 'plant-curious',
	`tags` json NOT NULL,
	`asinsUsed` json NOT NULL,
	`internalLinks` json NOT NULL,
	`wordCount` int NOT NULL DEFAULT 0,
	`heroUrl` varchar(500) NOT NULL DEFAULT '',
	`heroAlt` varchar(320) NOT NULL DEFAULT '',
	`galleryUrls` json NOT NULL,
	`author` varchar(80) NOT NULL DEFAULT 'The Oracle Lover',
	`authorCredential` varchar(200) NOT NULL DEFAULT 'plant-based curiosity, 10+ years of writing about gentle dietary change',
	`selfReference` text NOT NULL,
	`openerType` varchar(40) NOT NULL DEFAULT 'provocative-question',
	`conclusionType` varchar(40) NOT NULL DEFAULT 'reflection',
	`status` enum('queued','published','draft') NOT NULL DEFAULT 'queued',
	`queuedAt` timestamp NOT NULL DEFAULT (now()),
	`publishedAt` timestamp,
	`lastModifiedAt` timestamp,
	`seedSource` varchar(80) NOT NULL DEFAULT 'manual',
	`qualityScore` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `cronRuns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`job` varchar(64) NOT NULL,
	`status` enum('ok','skipped','error') NOT NULL,
	`detail` text NOT NULL,
	`ranAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cronRuns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savedArticles` (
	`userId` int NOT NULL,
	`articleId` int NOT NULL,
	`savedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `savedArticles_userId_articleId_pk` PRIMARY KEY(`userId`,`articleId`)
);
--> statement-breakpoint
CREATE TABLE `verifiedAsins` (
	`asin` varchar(16) NOT NULL,
	`title` varchar(320) NOT NULL DEFAULT '',
	`category` varchar(80) NOT NULL DEFAULT '',
	`tags` json NOT NULL,
	`status` enum('valid','invalid','unknown') NOT NULL DEFAULT 'unknown',
	`lastChecked` timestamp NOT NULL DEFAULT (now()),
	`reason` varchar(200) NOT NULL DEFAULT '',
	CONSTRAINT `verifiedAsins_asin` PRIMARY KEY(`asin`)
);
--> statement-breakpoint
CREATE INDEX `articles_status_queuedAt` ON `articles` (`status`,`queuedAt`);--> statement-breakpoint
CREATE INDEX `articles_status_publishedAt` ON `articles` (`status`,`publishedAt`);--> statement-breakpoint
CREATE INDEX `articles_category` ON `articles` (`category`);--> statement-breakpoint
CREATE INDEX `cronRuns_job` ON `cronRuns` (`job`);--> statement-breakpoint
CREATE INDEX `cronRuns_ranAt` ON `cronRuns` (`ranAt`);