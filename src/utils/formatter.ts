export function superFormatter(kodeMentah: string, bahasa: string): string {
    if (!kodeMentah) return "";
    const lang = bahasa.toLowerCase();
  
    if (kodeMentah.includes("\n")) return kodeMentah;
  
    let hasil = "";
    let indent = 0;
    const teks = kodeMentah.trim();
  
    if (["css", "javascript", "js", "typescript", "ts"].includes(lang)) {
      for (let i = 0; i < teks.length; i++) {
        const char = teks[i];
        if (char === "{") {
          indent++;
          hasil += " {\n" + "  ".repeat(indent);
        } else if (char === "}") {
          indent = Math.max(0, indent - 1);
          hasil = hasil.trimEnd();
          hasil += "\n" + "  ".repeat(indent) + "}\n" + "  ".repeat(indent);
        } else if (char === ";") {
          hasil += ";\n" + "  ".repeat(indent);
        } else if (char === ",") {
          const barisSekarang = hasil.slice(hasil.lastIndexOf("\n"));
          if (barisSekarang.length > 30) {
            hasil += ",\n" + "  ".repeat(indent + 1);
          } else {
            hasil += ", ";
          }
        } else {
          if (char === " " && (hasil.endsWith("\n") || hasil.endsWith("  "))) continue;
          hasil += char;
        }
      }
      return hasil.replace(/^\s*}\s*/, "").replace(/\n\s*\n/g, "\n").trim();
    }
    return kodeMentah;
  }
  