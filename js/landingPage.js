const canvasMenu = document.querySelector('#canvasMenu');
const ctxMenu = canvasMenu.getContext('2d');
const Wid = canvasMenu.width;
const Hei = canvasMenu.height;

function drawCircuitLines() {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;

    const outerSpacing = 35;

    // Outer left line
    ctxMenu.beginPath();
    ctxMenu.moveTo(Wid / 8, Hei);
    ctxMenu.lineTo(Wid / 8, Hei / 2);
    ctxMenu.lineTo(Wid / 2, Hei / 2);
    ctxMenu.stroke();

    // Outer right line
    ctxMenu.beginPath();
    ctxMenu.moveTo((Wid / 8) * 7, Hei);
    ctxMenu.lineTo((Wid / 8) * 7, Hei / 2);
    ctxMenu.lineTo(Wid / 2, Hei / 2);
    ctxMenu.stroke();

    // Inner left line
    ctxMenu.beginPath();
    ctxMenu.moveTo(Wid / 8 - outerSpacing, Hei);
    ctxMenu.lineTo(Wid / 8 - outerSpacing, Hei / 2 - outerSpacing);
    ctxMenu.lineTo(Wid / 2, Hei / 2 - outerSpacing);
    ctxMenu.stroke();

    // Inner right line
    ctxMenu.beginPath();
    ctxMenu.moveTo((Wid / 8) * 7 + outerSpacing, Hei);
    ctxMenu.lineTo((Wid / 8) * 7 + outerSpacing, Hei / 2 - outerSpacing);
    ctxMenu.lineTo(Wid / 2, Hei / 2 - outerSpacing);
    ctxMenu.stroke();
}

