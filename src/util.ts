import { App, Notice, TFile } from "obsidian";
import { FileCleanerSettings } from "./settings";
import translate from "./i18n";

export const cleanFiles = async (app: App, setting: FileCleanerSettings) => {
  // 获取空白Markdown文件
  const mdFiles = app.vault.getMarkdownFiles();
  const emptyMdFiles: TFile[] = [];
  const emptyRegex = /\S/;
  for (const file of mdFiles) {
    const content = await app.vault.cachedRead(file);
    if (file.stat.size === 0) {
      emptyMdFiles.push(file);
    } else if (!emptyRegex.test(content)) {
      emptyMdFiles.push(file);
    }
  }

  // 获取未使用附件
  const files = app.vault.getFiles();
  const attachmentRegex = /(.jpg|.jpeg|.png|.gif|.svg|.pdf)$/i;
  const attachments: TFile[] = [];
  for (const file of files) {
    if (file.name.match(attachmentRegex)) {
      attachments.push(file);
    }
  }

  const usedAttachments: any = [];
  const resolvedLinks = app.metadataCache.resolvedLinks;
  if (resolvedLinks) {
    for (const [mdFile, links] of Object.entries(resolvedLinks)) {
      for (const [path, times] of Object.entries(resolvedLinks[mdFile])) {
        const attachmentMatch = path.match(attachmentRegex);
        if (attachmentMatch) {
          const file = app.vault.getAbstractFileByPath(path);
          usedAttachments.push(file);
        }
      }
    }
  }

  const unusedAttachments = attachments.filter(
    (file) => !usedAttachments.includes(file),
  );

  // 获取排除文件
  const excludedFiles: TFile[] = [];
  let cleanFiles = emptyMdFiles.concat(unusedAttachments);
  const excludedFolders = setting.excludedFolders;
  const excludedFoldersCleaned = new Set(
    excludedFolders.map((folderPath) => {
      return folderPath.trim();
    }),
  );
  excludedFoldersCleaned.delete("");
  for (const excludedFolder of excludedFoldersCleaned) {
    const pathRegex = new RegExp("^" + excludedFolder + "/");
    for (const file of cleanFiles) {
      if (pathRegex.test(file.path)) {
        excludedFiles.push(file);
      }
    }
  }

  // 执行清理
  cleanFiles = cleanFiles
    .concat(excludedFiles)
    .filter((v) => !cleanFiles.includes(v) || !excludedFiles.includes(v));
  const len = cleanFiles.length;
  if (len > 0) {
    const destination = setting.destination;
    for (const file of cleanFiles) {
      console.log(file.name + " cleaned");
      if (destination === "permanent") {
        await app.vault.delete(file);
      } else if (destination === "system") {
        await app.vault.trash(file, true);
      } else if (destination === "obsidian") {
        await app.vault.trash(file, false);
      }
    }
    new Notice(translate().Notifications.CleanSuccessful);
  } else {
    new Notice(translate().Notifications.NoFileToClean);
  }
};
