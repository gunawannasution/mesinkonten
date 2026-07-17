import Prism from "prismjs";

export function getPrismLang(bahasa: string) {
  const lang = bahasa.toLowerCase();
  if (lang === "html" || lang === "web" || lang === "markup") return Prism.languages.markup;
  if (lang === "javascript" || lang === "js") return Prism.languages.javascript;
  if (lang === "typescript" || lang === "ts") return Prism.languages.typescript;
  if (lang === "python" || lang === "py") return Prism.languages.python;
  if (lang === "css") return Prism.languages.css;
  return Prism.languages.javascript;
}
