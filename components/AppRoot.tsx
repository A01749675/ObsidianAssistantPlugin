import { useContext } from "react";
import { AppContext } from "../Provider/ContextProvider";
import { App } from "obsidian";
import { VIEW_TYPE_REACT } from "../ReactView";
import { CloseButton } from "./CloseButton";
import { ChatHistory } from "./ChatHistory";
import { AiResponse } from "./AiResponse";
export const AppRoot = () => {
	const context = useContext(AppContext);

	// If context is undefined, it means the Provider wasn't mounted
	if (!context) {
		return <div>Error: AppContext not found</div>;
	}

	const { handleClose, reactWindowOpen,setVisibility } = context;

	return (
		<div>
			<div style={{ padding: "10px" }} className="container">
				<h2>Open Ai chat</h2>
				<AiResponse />
				<CloseButton handleClose={handleClose} />
			</div>
            <br></br>
			{reactWindowOpen ? (
				<div className="container">
                    <button onClick={setVisibility}>Close Chat History</button>
					<ChatHistory />
				</div>
			) : (
				<div className="container">
                    <button onClick={setVisibility}>Open Chat History</button>
                </div>
			)}
		</div>
	);
};
