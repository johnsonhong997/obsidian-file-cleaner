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
