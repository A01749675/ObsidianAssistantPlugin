import {
	createContext,
	useState,
	ReactNode,
	useCallback,
	useEffect,
} from "react";
import AiAssistant from "main";
import { App } from "obsidian";
import { VIEW_TYPE_REACT } from "../ReactView";

// SettingsProvider is a provider component, not a React Context object, so don't call useContext on it here.
type ContextType = {
	reactWindowOpen: boolean;
	setReactWindowOpen: (open: boolean) => void;
	prompt: string;
	setPrompt: (open: string) => void;
	loading: boolean;
	setLoading: (open: boolean) => void;
	response: string;
	handleAsk: () => void;
	handleClose: () => void;
	messages: AiMessage[];
	setVisibility: () => void;
	addMessage: (message: string, role: string) => void;
	
};

type AiMessage = {
	role: string;
	content: string;
};

export const AppContext = createContext<ContextType | undefined>(undefined);
export let setPromptExternally: ((text: string) => void) | null = null;

type ProviderProps = {
	children?: ReactNode;
	plugin: AiAssistant;
};

export const ContextProvider = ({ children, plugin }: ProviderProps) => {
	const apiKey = plugin.settings.apiKey;
	const username = plugin.settings.name;

	const [reactWindowOpen, setReactWindowOpen] = useState(false);
	const [prompt, setPrompt] = useState("Say hello from obsidian");
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<AiMessage[]>([]);
	const [shouldTriggerAsk, setShouldTriggerAsk] = useState(false);
	useEffect(() => {
		setPromptExternally = (text: string) => {
			const newPrompt = `You are given the following text from the user's Obsidian note: "${text}".
								Please help the user by providing suggestions or improvements based on 
								this content.`;
			setPrompt(newPrompt);
		};
		return () => {
			setPromptExternally = null;
		};
	}, []);

	useEffect(() => {
		setPromptExternally = (text: string) => {
			const newPrompt = `You are given the following text from the user's Obsidian note: "${text}". 
							Please help the user by providing suggestions or improvements based on 
							this content.`;
			setPrompt(newPrompt);
			setShouldTriggerAsk(true);
		};
		return () => {
			setPromptExternally = null;
		};
	}, []);

	useEffect(() => {
		if (shouldTriggerAsk && prompt.trim().length > 0) {
			handleAsk();
			setShouldTriggerAsk(false); // reset flag
		}
	}, [prompt, shouldTriggerAsk]);

	const handleClose = () => {
		const app = (window as any).app as App;
		const leaves = app.workspace.getLeavesOfType(VIEW_TYPE_REACT);
		for (const leaf of leaves) {
			leaf.detach();
		}
	};

	const addMessage = (message: string, role: string) => {
		console.log("Adding message:", { role, content: message });
		setMessages((prev) => {
			const newMessages = [...prev, { role, content: message }];
			console.log("Messages updated:", newMessages);
			return newMessages;
		});
	};

	const handleAsk = async () => {
		if (!apiKey) {
			alert("No API key set!");
			return;
		}
		addMessage(prompt, "user");
		setLoading(true);
		try {
			const res = await fetch(
				"https://api.openai.com/v1/chat/completions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
					},
					body: JSON.stringify({
						model: "gpt-4o-mini",
						messages: [
							{
								role: "user",
								content: `You are a usefull assistant to improve notes in obsidian.
                  This plugin was built by Ikerfdev.
                  You currently are in a betta version on development. 
                  Your name is NoteAi. 
                  You must respond to the user prompt and address them by their name, which is: ${username}
									This is the user prompt:" ${prompt}`,
							},
						],
					}),
				}
			);

			const data = await res.json();
			console.log("OpenAI response:", data);

			if (data?.choices?.[0]?.message?.content) {
				const msg: string = data.choices[0].message.content;
				setResponse(msg);
				addMessage(msg, "assistant");
				plugin.appendNote(msg,prompt);
			} else {
				setResponse("No response received from OpenAI.");
			}
		} catch (err) {
			console.error("Error calling OpenAI:", err);
			setResponse("Error: " + (err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	const setVisibility = () => {
		setReactWindowOpen(!reactWindowOpen);
	};
	return (
		<AppContext.Provider
			value={{
				reactWindowOpen,
				setReactWindowOpen,
				prompt,
				setPrompt,
				loading,
				setLoading,
				response,
				handleAsk,
				handleClose,
				messages,
				setVisibility,
				addMessage,
				
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
