const REQUIRED_FILES = [
  "src/App.jsx",
  "src/main.jsx",
  "src/index.css",
];

export async function validateWebsiteFiles(files) {
  const errors = [];
  const warnings = [];

  // 1. Check the generated files array.
  if (!Array.isArray(files)) {
    return {
      valid: false,
      errors: ["Generated files must be an array."],
      warnings,
    };
  }

  // 2. Validate file objects and paths.
  for (const file of files) {
    if (!file || typeof file !== "object") {
      errors.push("Generated files contain an invalid file entry.");
      continue;
    }

    if (typeof file.path !== "string" || !file.path.trim()) {
      errors.push("Every generated file must have a valid path.");
      continue;
    }

    if (typeof file.content !== "string" || !file.content.trim()) {
      errors.push(`File is empty or invalid: ${file.path}`);
    }
  }

  const validFileEntries = files.filter(
    (file) =>
      file &&
      typeof file === "object" &&
      typeof file.path === "string" &&
      file.path.trim()
  );

  const paths = validFileEntries.map((file) => file.path);

  // 3. Check for required files.
  for (const requiredPath of REQUIRED_FILES) {
    if (!paths.includes(requiredPath)) {
      errors.push(`Missing required file: ${requiredPath}`);
    }
  }

  // 4. Reject duplicate paths.
  if (new Set(paths).size !== paths.length) {
    errors.push("Generated files contain duplicate paths.");
  }

  // 5. Reject unexpected file paths.
  for (const filePath of paths) {
    if (!REQUIRED_FILES.includes(filePath)) {
      errors.push(`Unexpected file path: ${filePath}`);
    }
  }

  // 6. Find the three expected files.
  const appFile = validFileEntries.find(
    (file) => file.path === "src/App.jsx"
  );

  const mainFile = validFileEntries.find(
    (file) => file.path === "src/main.jsx"
  );

  const cssFile = validFileEntries.find(
    (file) => file.path === "src/index.css"
  );

  // 7. Validate App.jsx.
  if (appFile?.content?.trim()) {
    if (!/\bexport\s+default\b/.test(appFile.content)) {
      errors.push("App.jsx must contain a default export.");
    }
  }

  // 8. Validate main.jsx.
  if (mainFile?.content?.trim()) {
    const mainContent = mainFile.content;

    const importsApp =
      /import\s+(?:[\s\S]*?\s+from\s*)?["']\.\/App(?:\.jsx)?["']/.test(
        mainContent
      );

    const importsCss =
      /import\s+["']\.\/index\.css["']/.test(mainContent);

    if (!importsApp) {
      errors.push(
        "main.jsx must import ./App.jsx or ./App."
      );
    }

    if (!importsCss) {
      errors.push(
        "main.jsx must import ./index.css."
      );
    }

    if (!/\bcreateRoot\s*\(/.test(mainContent)) {
      warnings.push(
        "main.jsx does not appear to use React createRoot()."
      );
    }
  }

  // 9. Check CSS content.
  if (cssFile?.content?.trim()) {
    const hasTailwindDirectives =
      /@tailwind\s+(base|components|utilities)\s*;/.test(
        cssFile.content
      );

    const hasRegularCss =
      /[.#a-zA-Z][^{]*\{[^}]*\}/.test(cssFile.content);

    if (!hasTailwindDirectives && !hasRegularCss) {
      warnings.push(
        "index.css does not appear to contain Tailwind directives or regular CSS rules."
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}