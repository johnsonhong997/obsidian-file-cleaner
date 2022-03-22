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
import { getEmptyMdFiles, getUnusedAttachments, clearFiles } from "./util";
import { t } from "./translations/helper";

export default class FileCleanerPlugin extends Plugin {
	plugin: FileCleanerPlugin;
	settings: FileCleanerSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon("trash", t("Clear files"), (evt: MouseEvent) => {
			clearFiles(this.app, this.settings);
		});

		this.addCommand({
			id: "clean-files",
			name: t("Clear files"),
			callback: () => {
				clearFiles(this.app, this.settings);
			},
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
