import { useState } from "react";
import Input from "./Input";

export default function PasswordInput(props) {
  const [show, setShow] = useState(false);
  return (
    <Input {...props} type={show ? "text" : "password"}
      right={
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-2 text-xs font-semibold text-muted hover:text-ink">
          {show ? "Hide" : "Show"}
        </button>
      } />
  );
}
