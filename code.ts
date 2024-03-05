figma.showUI(__html__, { themeColors: true });

//Loads the fonts
(async () => {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
})();

function generateTableRow(cols: number, foreground: string, background: string): FrameNode {
    const row = figma.createFrame();
    row.layoutMode = "HORIZONTAL";
    row.primaryAxisAlignItems = "CENTER";
    row.counterAxisAlignItems = "CENTER";
    row.itemSpacing = 0;

    for (let col = 1; col <= cols; col++) {
        const text = figma.createText();
        text.characters = `Column ${col}`;
        text.fills = [figma.util.solidPaint(foreground)]; //paints the text with string hex values

        const column = figma.createFrame();
        column.name = `Column ${col}`;
        column.fills = [figma.util.solidPaint(background)]; //paints the frame with string hex values

        column.layoutMode = "HORIZONTAL";
        column.primaryAxisAlignItems = "CENTER"; //Horizontal (primary) Center align
        column.counterAxisAlignItems = "CENTER"; //Vertical (counter) Center align
        column.appendChild(text);

        column.layoutSizingVertical = "HUG";
        column.paddingTop = 10;
        column.paddingBottom = 10;

        row.appendChild(column);
        column.layoutSizingHorizontal = "FILL";
    }
    row.layoutSizingVertical = "HUG";
    return row;
}

interface tableProps {
    type: string; //Message type

    rows: number; //number of rows
    cols: number; //number of cols
    headerBg: string; //header background
    headerFg: string; //header foreground
    dataBg: string; //data background
    dataFg: string; //data foreground
}

figma.ui.onmessage = (msg: tableProps) => {
    const { type, cols, rows, headerBg, headerFg, dataBg, dataFg } = msg;
    if (type !== "Create-Table") {
        figma.closePlugin();
        return;
    }

    console.log(msg);

    const nodes: SceneNode[] = [];

    //Creation of the table
    const table = figma.createFrame();
    table.name = "table";
    table.layoutMode = "VERTICAL";
    table.primaryAxisAlignItems = "MIN";
    table.counterAxisAlignItems = "CENTER";
    table.resize(150 * cols, 10 * rows);

    //Header
    const header = generateTableRow(cols, headerFg, headerBg);
    header.name = "header";

    //Data
    const data = figma.createFrame();
    data.name = "data";
    data.layoutMode = "VERTICAL";
    data.primaryAxisAlignItems = "MIN";
    data.counterAxisAlignItems = "CENTER";

    //Filling data
    for (let row = 1; row <= rows; row++) {
        const dataRow = generateTableRow(cols, dataFg, dataBg);
        dataRow.name = `Row ${row}`;
        data.appendChild(dataRow);
    }
    data.layoutSizingVertical = "HUG";

    header.resize(header.children.length * 150, 100); //150px width for each children
    header.layoutSizingVertical = "HUG";

    table.appendChild(header);
    header.layoutSizingHorizontal = "FILL";

    table.appendChild(data);
    data.layoutSizingHorizontal = "FILL";
    table.layoutSizingVertical = "HUG";

    data.children.forEach((child) => {
        const row = child as FrameNode;
        row.layoutSizingHorizontal = "FILL";
    });

    figma.currentPage.appendChild(table);
    nodes.push(table);
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);

    figma.closePlugin();
};

