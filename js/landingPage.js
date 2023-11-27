const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

function drawCircuitLines() {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;

    const outerSpacing = 35;

    // Outer left line
    ctx.beginPath();
    ctx.moveTo(W / 8, H);
    ctx.lineTo(W / 8, H / 2);
    ctx.lineTo(W / 2, H / 2);
    ctx.stroke();

    // Outer right line
    ctx.beginPath();
    ctx.moveTo((W / 8) * 7, H);
    ctx.lineTo((W / 8) * 7, H / 2);
    ctx.lineTo(W / 2, H / 2);
    ctx.stroke();

    // Inner left line
    ctx.beginPath();
    ctx.moveTo(W / 8 - outerSpacing, H);
    ctx.lineTo(W / 8 - outerSpacing, H / 2 - outerSpacing);
    ctx.lineTo(W / 2, H / 2 - outerSpacing);
    ctx.stroke();

    // Inner right line
    ctx.beginPath();
    ctx.moveTo((W / 8) * 7 + outerSpacing, H);
    ctx.lineTo((W / 8) * 7 + outerSpacing, H / 2 - outerSpacing);
    ctx.lineTo(W / 2, H / 2 - outerSpacing);
    ctx.stroke();
}

drawCircuitLines();