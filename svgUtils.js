export function loadTrash() {
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");

    // Create the first path element
    const path1 = document.createElementNS(NS, "path");
    path1.setAttribute("fill-rule", "evenodd");
    path1.setAttribute("clip-rule", "evenodd");
    path1.setAttribute("d", "M17 5V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V5H4C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H5V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H17ZM15 4H9V5H15V4ZM17 7H7V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V7Z");
    path1.setAttribute("fill", "currentColor");

    // Create the second path element
    const path2 = document.createElementNS(NS, "path");
    path2.setAttribute("d", "M9 9H11V17H9V9Z");
    path2.setAttribute("fill", "currentColor");

    // Create the third path element
    const path3 = document.createElementNS(NS, "path");
    path3.setAttribute("d", "M13 9H15V17H13V9Z");
    path3.setAttribute("fill", "currentColor");

    // Append the paths to the SVG
    svg.appendChild(path1);
    svg.appendChild(path2);
    svg.appendChild(path3);

    return svg;
}

export function loadSaved() {
    const NS = 'http://www.w3.org/2000/svg'; //nameSpace
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    // Create the path element
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('clip-rule', 'evenodd');
    path.setAttribute('d', 'M19 20H17.1717L12.7072 15.5354C12.3166 15.1449 11.6835 15.1449 11.2929 15.5354L6.82843 20L5 20V7C5 5.34315 6.34315 4 8 4H16C17.6569 4 19 5.34314 19 7V20ZM17 7C17 6.44772 16.5523 6 16 6H8C7.44772 6 7 6.44772 7 7V17L9.87873 14.1212C11.0503 12.9497 12.9498 12.9497 14.1214 14.1212L17 16.9999V7Z');
    path.setAttribute('fill', 'currentColor');

    svg.appendChild(path)

    return svg;
}