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
			for (let i = 0; i < files.length; i++) {
				if (files[i].stat.size === 0) {
					cleanFiles.push(files[i]);
				}
			}

			// 执行删除
			var len = cleanFiles.length;
			if (len > 0) {
				for (let i = 0; i < cleanFiles.length; i++) {
					console.log(cleanFiles[i].name + " deleted");
					this.app.vault.delete(cleanFiles[i]);
				}
				new Notice("Cleanup successful");
			} else {
				new Notice("No file to clean");
			}
		});
	}

	onunload() {}
}
