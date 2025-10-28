import { useContext } from "react";
import { AppContext } from "../Provider/ContextProvider";
import { InputText } from "./InputText";

export const AiResponse = () => {
	const context = useContext(AppContext);

	if (!context) {
		return <div>Error: AppContext not found</div>;
	}

	const { loading, response, handleAsk } = context;

	return (
		<div className="airesponse-container">
			<div className="airesponse-input-row">
				<InputText />

				<button
					className="airesponse-button"
					onClick={handleAsk}
					disabled={loading}
				>
					{loading ? "Loading..." : "Ask OpenAI"}
				</button>
			</div>

			{response && (
				<div className="airesponse-output">
					<strong>Response:</strong>
					<p>{response}</p>
					<button
						className="copy-button"
						onClick={(e) => {
							e.stopPropagation(); // ✅ Prevent Obsidian losing focus
							e.preventDefault(); // ✅ Avoid accidental editor interference
							navigator.clipboard.writeText(response);
              alert("Copied to clipboard!");
						}}
					>
						📋
					</button>
				</div>
			)}
		</div>
	);
};

export default AiResponse;
