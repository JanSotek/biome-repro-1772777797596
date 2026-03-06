# Biome LSP high-fidelity repro

This reproduction intentionally mirrors the original project configuration:
- copied `.vscode/settings.json`
- copied project `biome.json`
- copied base config as `format-lab-biome.json`
- copied triggering file as `src/index.ts`

## Reproduce
1. Open this folder in VS Code.
2. Ensure Biome extension is enabled.
3. Open `src/index.ts`.
4. In the `return` statement near the end of the file, insert empty lines between the `x...` fields, for example:

```ts
return {
	x1: x24,
	x8: !x26 || x48,
	x3: x16,
	x4: x18,
	x7: x55,
	x5: x20,
	x6: x22,
	x2: x52?.readOnly || false,
	x9: x65,
	x10: x69,
	x11: x50,
};
```

5. Repeat edits with different counts of inserted lines between these fields.
6. Save once after an edit; on some attempts, press save twice quickly in a row (`Ctrl+S`, `Ctrl+S`).

## Observed in original project
- `position Position { line: ..., character: 0 } is out of range`
- `Source Location: crates\\biome_lsp\\src\\utils.rs:405:22`
- `Message: assertion failed: self.is_char_boundary(n)`

If the crash reproduces here, this repo can be shared directly.
If not, it still helps narrowing required context.
