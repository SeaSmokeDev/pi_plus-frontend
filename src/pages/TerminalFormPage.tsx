import { useLocation } from "react-router-dom";
import TerminalFormHeader from "../components/terminal-form/TerminalFormHeader";
import TerminalReadonlyInfo from "../components/terminal-form/TerminalReadonlyInfo";
import TerminalEditableInfo from "../components/terminal-form/TerminalEditableForm";

type TerminalFormLocationState = {
  mode?: "create" | "edit";
  terminalId?: number;
  terminalSN?: string;
};

function TerminalFormPage() {
  const location = useLocation();
  const locationState = location.state as TerminalFormLocationState | null;
  const isCreateMode = locationState?.mode === "create";

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <TerminalFormHeader isCreateMode={isCreateMode} />
        <div className="card-body">
          <TerminalReadonlyInfo isCreateMode={isCreateMode} />
          <hr className="my-4" />
          <TerminalEditableInfo isCreateMode={isCreateMode} />
        </div>
      </div>
    </div>
  );
}

export default TerminalFormPage;
