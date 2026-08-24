import { useEffect } from "react";
import authCss from "../styles/auth.css?inline";

export default function AuthStyles() {
  useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-fasco-auth", "true");
    style.textContent = authCss;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);
  return null;
}
