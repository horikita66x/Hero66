// Модуль генеративной графики органов зрения (Abyssal Eyes Engine)
window.EyeModule = {
    currentX: 0, currentY: 0, targetX: 0, targetY: 0,
    saccadeX: 0, saccadeY: 0, pupilPulse: 1.0,

    update: function() {
        if (Math.random() < 0.015) {
            let angle = Math.random() * Math.PI * 2;
            let dist = Math.random() * 11;
            this.targetX = Math.cos(angle) * dist;
            this.targetY = Math.sin(angle) * dist;
        }
        this.currentX += (this.targetX - this.currentX) * 0.07;
        this.currentY += (this.targetY - this.currentY) * 0.07;
        this.saccadeX = Math.random() < 0.12 ? (Math.random() - 0.5) * 1.8 : 0;
        this.saccadeY = Math.random() < 0.12 ? (Math.random() - 0.5) * 1.8 : 0;
        this.pupilPulse = 0.9 + Math.sin(Date.now() * 0.002) * 0.15;
    },

    render: function(ctx, cx, cy, angle, isRight, time) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Кожаные складки венозного мешка вокруг глазницы (прорисовка объема)
        for(let i = 16; i > 0; i--) {
            ctx.beginPath();
            ctx.ellipse(0, 0, 90 + i * 2, 34 + i, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${20 - i}, 2, 2, ${0.04 + (i * 0.003)})`;
            ctx.fill();
        }

        // Внутренний провал глазного яблока
        ctx.beginPath();
        ctx.ellipse(0, 0, 90, 32, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#020000';
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        // Механика естественного моргания века
        let blink = Math.sin(time * 0.15) > 0.97 ? 0.01 : 1.0;
        ctx.ellipse(0, 0, 90, 32 * blink, 0, 0, Math.PI * 2);
        ctx.clip();

        let lx = this.currentX + this.saccadeX;
        let ly = this.currentY + this.saccadeY;
        if (isRight) lx = -lx;

        // Послойный сферический градиент роговицы
        let irisGrad = ctx.createRadialGradient(lx, ly, 2, lx, ly, 46);
        irisGrad.addColorStop(0, '#000000');
        irisGrad.addColorStop(0.2, '#1a0000');
        irisGrad.addColorStop(0.4, '#5e0101');
        irisGrad.addColorStop(0.65, '#bd0000');
        irisGrad.addColorStop(0.85, '#ff3333');
        irisGrad.addColorStop(0.95, '#ff9999');
        irisGrad.addColorStop(1, '#1f0000');

        ctx.beginPath();
        ctx.arc(lx, ly, 40, 0, Math.PI * 2);
        ctx.fillStyle = irisGrad;
        ctx.fill();

        // Процедурные капилляры (генерация сетки кровеносных сосудов в глазу)
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.25)';
        ctx.lineWidth = 0.6;
        for (let i = 0; i < 24; i++) {
            let seed = i * 15;
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(lx + Math.cos(seed) * 38, ly + Math.sin(seed) * 38);
            ctx.stroke();
        }

        // Вертикальный щелевидный зрачок
        ctx.beginPath();
        ctx.ellipse(lx, ly, 3.8 * this.pupilPulse, 28, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();

        // 3D-Блики влажной поверхности глаза
        ctx.beginPath();
        ctx.arc(lx - 14, ly - 14, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(lx + 18, ly + 10, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();

        ctx.restore();
        ctx.restore();
    }
};
