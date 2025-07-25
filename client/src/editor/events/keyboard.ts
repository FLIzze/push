import { editorState } from "../state";
import { setupPalette } from "../ui/palette";
import { updateToolSelectionUI } from "../ui/tools";

export function handleToolSelection(e: KeyboardEvent) {
    switch (e.key) {
        case "a":
            editorState.selectedTool = "add";
            updateToolSelectionUI();
            break;
        case "d":
            editorState.selectedTool = "delete";
            updateToolSelectionUI();
            break;
        case "c":
            editorState.isCreatingTile = !editorState.isCreatingTile;
            setupPalette();
            break;
        default:
            break;
    }
}
