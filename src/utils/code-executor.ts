import * as fs from "fs";
import * as path from "path";
import { spawnSync } from "child_process";

export function eksekusiKodeAsli(bahasa: string, kode: string, id: string): string {
  if (["html", "css", "web"].includes(bahasa)) {
    return "Layout rendered successfully.";
  }
  
  if (!kode.trim()) return "Tidak ada kode untuk dieksekusi.";

  const extension = bahasa === 'python' ? 'py' : 'js';
  const runtime = bahasa === 'python' ? 'python' : 'node';
  const tempFile = path.join(process.cwd(), `temp_${id}.${extension}`);
  
  try {
    fs.writeFileSync(tempFile, kode, "utf8");
    
    // Menggunakan spawnSync lebih aman dibanding execSync
    const result = spawnSync(runtime, [tempFile], { 
      timeout: 3000,
      encoding: 'utf-8' 
    });

    if (result.error) {
      return `Runtime Error: ${result.error.message}`;
    }

    if (result.stderr) {
      return `Execution Error: ${result.stderr.trim()}`;
    }

    return result.stdout.trim() || "Kode berhasil dijalankan (tanpa output).";
  } catch (error) {
    return `System Error: ${error instanceof Error ? error.message : String(error)}`;
  } finally {
    if (fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch (e) { console.error("Gagal hapus file:", e); }
    }
  }
}