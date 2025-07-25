import { paletteContainer, paletteDiv } from "../eventListener";
import { palette, tileEditor } from "../state";

export function setupTiles() {
    paletteContainer.style.left = `${palette.coords.x}px`;
    paletteContainer.style.top = `${palette.coords.y}px`;

    for (const gradient of palette.colors) {
        for (const color of gradient) {
            const button = document.createElement("button");

            button.classList.add("palette-color");
            button.style.backgroundColor = color;

            button.addEventListener("click", () => {
                document.querySelectorAll(".palette-color.selected").forEach(el => {
                    el.classList.remove("selected");
                });

                button.classList.add("selected");
                tileEditor.selectedColor = color;
            });

            paletteDiv.appendChild(button);
        }
    }
}
