import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../Provider/ContextProvider";

export const ChatHistory = () => {
	const context = useContext(AppContext);
	const chatEndRef = useRef<HTMLDivElement | null>(null);

	if (!context) {
		return <div>Error: AppContext not found</div>;
	}

	const { messages } = context;

	// Auto-scroll to the latest message
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="chat-history">
			{messages.length === 0 ? (
				<p className="chat-empty">No messages yet.</p>
			) : (
				messages.map((msg, index) => (
					<div key={index} className={`chat-message ${msg.role}`}>
						<div className="chat-bubble">{msg.content}</div>
						<button
							className="copy-button"
							onClick={(e) => {
								e.stopPropagation(); // ✅ Prevent Obsidian losing focus
								e.preventDefault(); // ✅ Avoid accidental editor interference
								navigator.clipboard.writeText(msg.content);
							}}
						>
							📋
						</button>
					</div>
				))
			)}
			<div ref={chatEndRef} />
		</div>
	);
};

export default ChatHistory;
