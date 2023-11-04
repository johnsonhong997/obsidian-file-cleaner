import { Plugin } from "obsidian";
import {
  FileCleanerSettings,
  DEFAULT_SETTINGS,
  FileCleanerSettingTab,
} from "./settings";
import { cleanFiles } from "./util";
import translate from "./i18n";

export default class FileCleanerPlugin extends Plugin {
  plugin: FileCleanerPlugin;
  settings: FileCleanerSettings;

  async onload() {
    await this.loadSettings();

    this.addRibbonIcon(
      "trash",
      translate().Buttons.CleanFiles,
      (evt: MouseEvent) => {
        cleanFiles(this.app, this.settings);
      },
    );

    this.addCommand({
      id: "clean-files",
      name: translate().Buttons.CleanFiles,
      callback: () => {
        cleanFiles(this.app, this.settings);
      },
    });

    this.addSettingTab(new FileCleanerSettingTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
