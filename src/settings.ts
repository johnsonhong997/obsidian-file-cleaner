import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import FileCleanerPlugin from "./main";
import { t } from "./translations/helper";

//定义设置接口
export interface FileCleanerSettings {
	destination: string;
}

//定义默认设置
export const DEFAULT_SETTINGS: FileCleanerSettings = {
	destination: "permanent",
};

//设置选项卡
export class FileCleanerSettingTab extends PluginSettingTab {
	plugin: FileCleanerPlugin;

	constructor(app: App, plugin: FileCleanerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		this.containerEl.empty();

		new Setting(containerEl)
			.setName(t("cleanedFilesName"))
			.setDesc(t("cleanedFilesDesc"))
			.addDropdown((dropdown) =>
				dropdown
					.addOption("permanent", t("deleteOption"))
					.addOption("system", t("systemTrashOption"))
					.addOption("obsidian", t("obsidianTrashOption"))
					.setValue(this.plugin.settings.destination)
					.onChange((value) => {
						this.plugin.settings.destination = value;
						this.plugin.saveSettings();
					})
			);
	}
}
