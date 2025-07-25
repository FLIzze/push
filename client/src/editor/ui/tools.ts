import { toolsContainer, toolsDiv } from "../eventListener";
import { editorState, tools } from "../state";

export function setupTools() {
    toolsContainer.style.left = `${tools.coords.x}px`;
    toolsContainer.style.top = `${tools.coords.y}px`;

    for (const tool of tools.tools) {
        const img = document.createElement("img");

        img.classList.add("img");
        img.src = tool.img;
        img.alt = tool.name;
        img.title = `${tool.name} (${tool.shortcut})`;

        img.addEventListener("click", () => {
            document.querySelectorAll(".img.selected").forEach(el => {
                el.classList.remove("selected");
            });

            img.classList.add("selected");
            editorState.selectedTool = tool.name;
        });

        toolsDiv.appendChild(img);
    }
}

export function updateToolSelectionUI() {
    document.querySelectorAll(".img.selected").forEach(el => {
        el.classList.remove("selected");
    });

    const imgs = document.querySelectorAll(".img");

    imgs.forEach(img => {
        if (img.getAttribute("alt") === editorState.selectedTool) {
            img.classList.add("selected");
        }
    });
}
