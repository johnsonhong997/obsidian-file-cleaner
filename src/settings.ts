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
import FileCleanerPlugin from ".";
import { t } from "./translations/helper";

//定义设置接口
export interface FileCleanerSettings {
	destination: string;
	excluded: string;
}

//定义默认设置
export const DEFAULT_SETTINGS: FileCleanerSettings = {
	destination: "system",
	excluded: "",
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

		this.containerEl.createEl("h1", { text: t("Regular Options") });

		new Setting(containerEl)
			.setName(t("Cleaned files"))
			.setDesc(t("What do you want to do with cleaned files?"))
			.addDropdown((dropdown) =>
				dropdown
					.addOption("system", t("Move to system trash"))
					.addOption(
						"obsidian",
						t("Move to Obsidian trash (.trash folder)")
					)
					.addOption("permanent", t("Permanently delete"))
					.setValue(this.plugin.settings.destination)
					.onChange((value) => {
						this.plugin.settings.destination = value;
						this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName(t("Excluded Folders"))
			.setDesc(t("Files in excluded folders will not be cleaned up. Paths are case-sensitive, each path is separated by a newline. Example: folder/subfolder"))
			.addTextArea((text) =>
				text
					.setValue(this.plugin.settings.excluded)
					.onChange(async (value) => {
						this.plugin.settings.excluded = value;
						this.plugin.saveSettings();
					})
			);
	}
}
