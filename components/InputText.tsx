import { useContext } from "react";
import { AppContext } from "../Provider/ContextProvider";

export const InputText = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: AppContext not found</div>;
  }

  const { prompt, setPrompt } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: string = e.target.value;
    setPrompt(newValue);
  };

  return (
    <div className="airesponse-input-wrapper">
      <label htmlFor="customInput" className="airesponse-label">
        Type something:
      </label>
      <input
        id="customInput"
        type="text"
        className="airesponse-input"
        value={prompt}
        onChange={handleChange}
        placeholder="Write here..."
      />
    </div>
  );
};
