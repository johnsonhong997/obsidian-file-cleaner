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

export default class FileCleanerPlugin extends Plugin {
	plugin: FileCleanerPlugin;
	settings: FileCleanerSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon("dice", "File Cleaner", async () => {
			// 获取文件列表
			const files = this.app.vault.getMarkdownFiles();

			// 筛选出需要删除的文件
			var cleanFiles: TFile[] = [];
			for (let file of files) {
				if (file.stat.size === 0) {
					cleanFiles.push(file);
				}
			}

			// 执行删除
			var len = cleanFiles.length;
			if (len > 0) {
				var destination = this.settings.destination;
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
				new Notice("Cleanup successful");
			} else {
				new Notice("No file to clean");
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
