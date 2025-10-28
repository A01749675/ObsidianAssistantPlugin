import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { AppRoot } from "./components/AppRoot";
import { StrictMode } from "react";
import { ContextProvider } from "./Provider/ContextProvider";
import AiAssistant from "main";
export const VIEW_TYPE_REACT = "my-react-view";

export class ReactView extends ItemView {
	root: Root | null = null;
	plugin: AiAssistant;
	constructor(leaf: WorkspaceLeaf,plugin?:AiAssistant) {
		super(leaf);
		this.plugin = plugin!;
	}

	getViewType() {
		return VIEW_TYPE_REACT;
	}

	getDisplayText() {
		return "My react panel";
	}

	async onOpen() {
		this.root = createRoot(this.contentEl);
		this.root.render(
			<StrictMode>
					<ContextProvider  plugin={this.plugin}>
						<AppRoot />
					</ContextProvider>
			</StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
