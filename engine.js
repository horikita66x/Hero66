// Главный координатор био-механики (Core Abyssal Engine)
window.AbyssalEngine = {
    time: 0,
    
    init: function() {
        const canvas = document.getElementById('renderCanvas');
        const ctx = canvas.getContext('2d');
        
        // Генерация попиксельного шума для имитации пор влажной кожи
        const noiseCanvas = document.createElement('canvas');
        noiseCanvas.width = 120; noiseCanvas.height = 120;
        const nCtx = noiseCanvas.getContext('2d');
        const nData = nCtx.createImageData(120, 120);
        for (let i = 0; i < nData.data.length; i += 4) {
            let gray = Math.random() * 14;
            nData.data[i] = gray; nData.data[i+1] = 0; nData.data[i+2] = 0; nData.data[i+3] = 255;
        }
        nCtx.putImageData(nData, 0, 0);
        const skinPattern = ctx.createPattern(noiseCanvas, 'repeat');

        const tick = () => {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.time += 0.022;

            // Тригонометрия органического дыхания существа
            let breathY = Math.sin(this.time * 0.75) * 4.0;
            let jawOffset = Math.sin(this.time * 0.48 - 0.4) * 1.8;
            let tremorX = Math.sin(this.time * 14) * 0.18;
            let tremorY = Math.cos(this.time * 13) * 0.18;

            ctx.save();
            ctx.translate(canvas.width / 2 + tremorX, canvas.height / 2 + tremorY + breathY);

            // Рендеринг структуры пор
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = skinPattern;
            ctx.globalAlpha = 0.09;
            ctx.fillRect(-400, -400, 800, 800);
            ctx.restore();

            // Обновление и отрисовка систем органов
            if (window.EyeModule && window.MouthModule) {
                window.EyeModule.update();
                window.MouthModule.update();

                window.EyeModule.render(ctx, -155, -95, -17 * Math.PI / 180, false, this.time);
                window.EyeModule.render(ctx, 155, -95, 17 * Math.PI / 180, true, this.time);
                window.MouthModule.render(ctx, jawOffset, this.time);
            }

            ctx.restore();
            requestAnimationFrame(tick);
        };

        tick();
    }
};

// Запуск системы после загрузки всех скриптов
window.addEventListener('DOMContentLoaded', () => {
    window.AbyssalEngine.init();
});
