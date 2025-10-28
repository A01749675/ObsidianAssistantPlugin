import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile 
} from "obsidian";
//React
import { ReactView, VIEW_TYPE_REACT } from "./ReactView";
//trying to get selected text
import { setPromptExternally } from "./Provider/ContextProvider";
// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
	apiKey: string;
	name: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
	apiKey: "",
	name: "User",
};

export default class AiAssistant extends Plugin {
	settings: MyPluginSettings;
	async onload() {
		new Notice("AI Assistant loaded successfully!");
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (_evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('AAAAAAA');
		// });
		// Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-sample-modal-simple",
			name: "Open sample modal (simple)",
			callback: () => {
				new SampleModal(this.app).open();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// id: "get-selected-text",
		// name: "Get Selected Text",
		// editorCallback: (editor: Editor, view: MarkdownView) => {
		// 	const selectedText = editor.getSelection();
		// 	if (selectedText) {
		// 	new Notice(`Selected: "${selectedText}"`);
		// 	console.log("User selected:", selectedText);
		// 	} else {
		// 	new Notice("No text selected!");
		// 	}
		// },
		// });
		this.addCommand({
			id: "noteai-set-selected-text",
			name: "Set Selected Text as Prompt",
			editorCallback: (editor) => {
				const selected = editor.getSelection();
				if (selected && setPromptExternally) {
					setPromptExternally(selected);
					new Notice("Selected text sent to NoteAI prompt!");
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});
		// this.addRibbonIcon('dice', 'Greet', () => {
		// 	new Notice('Hello, world!');
		// });

		this.registerView(VIEW_TYPE_REACT, (leaf) => new ReactView(leaf, this));

		this.addRibbonIcon("dice", "Open React View", () => {
			this.activateView();
		});

		this.addCommand({
			id: "close-react-view",
			name: "Close React View",
			callback: () => this.closeView(),
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}
	async activateView() {
		let leaf = this.app.workspace.getRightLeaf(false);
		if (!leaf) {
			leaf = this.app.workspace.getLeaf(true);
		}
		await leaf.setViewState({ type: VIEW_TYPE_REACT, active: true });
		this.app.workspace.revealLeaf(leaf);
	}

	async closeView() {
		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_REACT);
		for (const leaf of leaves) {
			leaf.detach(); // closes the panel
		}
	}

	async appendNote(content: string,prompt:string) {
		const vault = this.app.vault; //my curr vaault
		const fileName = "AI Suggestions.md"; // Name of your note
		const folderPath = ""; // Optional: put "NoteAI" if you want a subfolder
		const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;
		const date = new Date().toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		});
		const formatCallout = (
		type: string,
		prompt: string,
		content: string,
		date: string
		): string => {
		// Prefix every line of the content so it stays inside the callout
		const formattedContent = content
			.split("\n")
			.map(line => `> ${line}`)
			.join("\n");

		// Return a full Markdown block
		return `> [!${type}] [${prompt}] — ${date}\n${formattedContent}`;
	}
		const template = formatCallout(
		"note",
		prompt,
		content,
		date
		);

		// const template = [
		// `> [!note] [${prompt}]-${formattedDate}`,
		// `> ${content}`
		// ].join("\n");

		let file = vault.getAbstractFileByPath(fullPath);

		if (file instanceof TFile) {
			// ✅ Note already exists → append content
			const oldText = await vault.read(file);
			await vault.modify(file, oldText + "\n\n" + template);
			new Notice(`✅ Appended to "${fileName}"`);
		} else {
			// ✅ Note doesn't exist → create a new one
			await vault.create(fullPath, `# AI Suggestions\n\n${template}`);
			new Notice(`📝 Created new note: "${fileName}"`);
		}
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: AiAssistant;

	constructor(app: App, plugin: AiAssistant) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// new Setting(containerEl)
		// 	.setName('Setting #1')
		// 	.setDesc('It\'s a secret')
		// 	.addText(text => text
		// 		.setPlaceholder('Enter your secret')
		// 		.setValue(this.plugin.settings.mySetting)
		// 		.onChange(async (value) => {
		// 			this.plugin.settings.mySetting = value;
		// 			await this.plugin.saveSettings();
		// 		}));
		new Setting(containerEl)
			.setName("API Key")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your api key")
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Username")
			.setDesc("whoami")
			.addText((text) =>
				text
					.setPlaceholder("Enter your name")
					.setValue(this.plugin.settings.name)
					.onChange(async (value) => {
						this.plugin.settings.name = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
