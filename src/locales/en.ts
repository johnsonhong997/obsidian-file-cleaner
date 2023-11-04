import { Locale } from "./locale";

// English
const enUS: Locale = {
  Settings: {
    RegularOptions: {
      Header: "Regular Options",

      CleanedFiles: {
        Label: "Cleaned files",
        Description: "What do you want to do with cleaned files?",

        Options: {
          MoveToSystemTrash: "Move to system trash",
          MoveToObsidianTrash: "Move to Obsidian trash (.trash folder)",
          PermanentDelete: "Permanently delete",
        },
      },

      ExcludedFolders: {
        Label: "Excluded Folders",
        Description: `
          Files in excluded folders will not be cleaned up.
          Paths are case-sensitive, each path is separated by a newline.`,
        Placeholder: "Example:\nfolder/subfolder\nfolder2/subfolder2",
      },
    },

    DangerZone: {
      Header: "Danger Zone",

      ResetSettings: {
        Label: "Reset Settings",
        Description: "Resets the configuration back to default values",
        Button: "Reset",
      },
    },
  },

  Modals: {
    ResetSettings: {
      Text: "Are you sure you want to reset the settings?",
    },
    ButtonNo: "No",
    ButtonYes: "Yes",
  },

  Buttons: {
    CleanFiles: "Clean files",
  },

  Notifications: {
    CleanSuccessful: "Clean successful",
    NoFileToClean: "No file to clean",
    SettingsReset: "File Cleaner: Setting reset",
  },
};

export default enUS;
