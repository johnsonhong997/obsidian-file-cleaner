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
import {
	FileCleanerSettings,
	DEFAULT_SETTINGS,
	FileCleanerSettingTab,
} from "./settings";
import { getEmptyMdFiles, getUnusedAttachments } from "./util";
import { t } from "./translations/helper";

export default class FileCleanerPlugin extends Plugin {
	plugin: FileCleanerPlugin;
	settings: FileCleanerSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon("trash", "File Cleaner", async () => {
			// 获取清理文件
			let emptyMdFiles = getEmptyMdFiles(this.app);
			let unusedAttachments = getUnusedAttachments(this.app);
			let cleanFiles: TFile[] = [...emptyMdFiles, ...unusedAttachments];

			// 执行清理
			let len = cleanFiles.length;
			if (len > 0) {
				let destination = this.settings.destination;
				for (let file of cleanFiles) {
					console.log(file.name + " cleaned");
					if (destination === "permanent") {
						await this.app.vault.delete(file);
					} else if (destination === "system") {
						await this.app.vault.trash(file, true);
					} else if (destination === "obsidian") {
						await this.app.vault.trash(file, false);
					}
				}
				new Notice(t("doCleanNotice"));
			} else {
				new Notice(t("doNotCleanNotice"));
			}
		});

		this.addSettingTab(new FileCleanerSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
