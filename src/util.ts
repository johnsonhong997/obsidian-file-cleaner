import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
} from "obsidian";
import { FileCleanerSettings } from "./settings";
import { t } from "./translations/helper";

export const getEmptyMdFiles = (app: App) => {
	// 获取Markdown文件
	let mdFiles = app.vault.getMarkdownFiles();

	// 获取空白Markdown文件
	let emptyMdFiles: TFile[] = [];
	for (let file of mdFiles) {
		if (file.stat.size === 0) {
			emptyMdFiles.push(file);
		}
	}
	return emptyMdFiles;
};

export const getUnusedAttachments = (app: App) => {
	// 获取附件
	let files = app.vault.getFiles();
	const attachmentRegex = /(.jpg|.jpeg|.png|.gif|.svg|.pdf)$/i;
	let attachments: TFile[] = [];
	for (let file of files) {
		if (file.name.match(attachmentRegex)) {
			attachments.push(file);
		}
	}

	// 获取已使用附件
	let usedAttachments: any = [];
	let resolvedLinks = app.metadataCache.resolvedLinks;
	if (resolvedLinks) {
		for (const [mdFile, links] of Object.entries(resolvedLinks)) {
			for (const [path, times] of Object.entries(resolvedLinks[mdFile])) {
				let attachmentMatch = path.match(attachmentRegex);
				if (attachmentMatch) {
					let file = app.vault.getAbstractFileByPath(path);
					usedAttachments.push(file);
				}
			}
		}
	}

	// 获取未使用附件
	let unusedAttachments = attachments.filter(
		(file) => !usedAttachments.includes(file)
	);

	return unusedAttachments;
};

export const getExcludedFiles = async (
	app: App,
	setting: FileCleanerSettings
) => {
	// 待完成
};

export const clearFiles = async (app: App, setting: FileCleanerSettings) => {
	// 获取清理文件
	let emptyMdFiles = getEmptyMdFiles(app);
	let unusedAttachments = getUnusedAttachments(app);
	let cleanFiles: TFile[] = [...emptyMdFiles, ...unusedAttachments];

	// 执行清理
	let len = cleanFiles.length;
	if (len > 0) {
		let destination = setting.destination;
		for (let file of cleanFiles) {
			console.log(file.name + " cleaned");
			if (destination === "permanent") {
				await app.vault.delete(file);
			} else if (destination === "system") {
				await app.vault.trash(file, true);
			} else if (destination === "obsidian") {
				await app.vault.trash(file, false);
			}
		}
		new Notice(t("Clean successful"));
	} else {
		new Notice(t("No file to clean"));
	}
};
