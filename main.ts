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

export default class CleanerPlugin extends Plugin {
	onload() {
		this.addRibbonIcon("dice", "File Cleaner", () => {
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
				for (let file of cleanFiles) {
					console.log(file.name + " deleted");
					(async () => {
						await this.app.vault.delete(file);
					})();
				}
				new Notice("Cleanup successful");
			} else {
				new Notice("No file to clean");
			}
		});
	}

	onunload() {}
}
