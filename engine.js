window.AbyssalEngine = {
    time: 0,
    init: function() {
        const canvas = document.getElementById('renderCanvas'); const ctx = canvas.getContext('2d');
        const loop = () => {
            ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.time += 0.025;
            
            // Тригонометрия органического дыхания (плавное покачивание)
            let breath = Math.sin(this.time * 0.65) * 3.5;
            let tx = Math.sin(this.time * 14) * 0.15; let ty = Math.cos(this.time * 12) * 0.15;
            
            ctx.save(); ctx.translate(canvas.width / 2 + tx, canvas.height / 2 + ty + breath);
            
            if (window.EyeModule) {
                window.EyeModule.update();
                // Отрисовка левого и правого глаза под зловещим углом
                window.EyeModule.render(ctx, -140, -20, -18 * Math.PI / 180, false, this.time);
                window.EyeModule.render(ctx, 140, -20, 18 * Math.PI / 180, true, this.time);
            }
            ctx.restore(); requestAnimationFrame(loop);
        };
        loop();
    }
};
window.addEventListener('DOMContentLoaded', () => { window.AbyssalEngine.init(); });
