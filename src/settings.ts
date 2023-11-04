import { App, PluginSettingTab, Setting } from "obsidian";
import FileCleanerPlugin from ".";
import translate from "./i18n";

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

    this.containerEl.createEl("h1", {
      text: translate().Settings.RegularOptions.Header,
    });

    new Setting(containerEl)
      .setName(translate().Settings.RegularOptions.CleanedFiles.Label)
      .setDesc(translate().Settings.RegularOptions.CleanedFiles.Description)
      .addDropdown((dropdown) =>
        dropdown
          .addOption(
            "system",
            translate().Settings.RegularOptions.CleanedFiles.Options
              .MoveToSystemTrash,
          )
          .addOption(
            "obsidian",
            translate().Settings.RegularOptions.CleanedFiles.Options
              .MoveToObsidianTrash,
          )
          .addOption(
            "permanent",
            translate().Settings.RegularOptions.CleanedFiles.Options
              .PermanentDelete,
          )
          .setValue(this.plugin.settings.destination)
          .onChange((value) => {
            this.plugin.settings.destination = value;
            this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName(translate().Settings.RegularOptions.ExcludedFolders.Label)
      .setDesc(translate().Settings.RegularOptions.ExcludedFolders.Description)
      .addTextArea((text) =>
        text.setValue(this.plugin.settings.excluded).onChange(async (value) => {
          this.plugin.settings.excluded = value;
          this.plugin.saveSettings();
        }),
      );
  }
}
