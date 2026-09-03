window.EyeModule = {
    cx: 0, cy: 0, tx: 0, ty: 0, sx: 0, sy: 0, pulse: 1.0,
    update: function() {
        if (Math.random() < 0.01) {
            let a = Math.random() * Math.PI * 2;
            let d = Math.random() * 14;
            this.tx = Math.cos(a) * d; this.ty = Math.sin(a) * d;
        }
        this.cx += (this.tx - this.cx) * 0.05;
        this.cy += (this.ty - this.cy) * 0.05;
        this.sx = Math.random() < 0.14 ? (Math.random() - 0.5) * 2.0 : 0;
        this.sy = Math.random() < 0.14 ? (Math.random() - 0.5) * 2.0 : 0;
        this.pulse = 0.85 + Math.sin(Date.now() * 0.002) * 0.15;
    },
    render: function(ctx, x, y, rot, isRight, time) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
        
        // Кожаные складки венозного мешка (3D веки)
        for(let i = 24; i > 0; i--) {
            ctx.beginPath(); ctx.ellipse(0, 0, 100 + i*2, 32 + i, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${24 - i}, 1, 1, ${0.025 + (i * 0.002)})`; ctx.fill();
        }
        
        ctx.beginPath(); ctx.ellipse(0, 0, 100, 30, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#010000'; ctx.fill();
        
        ctx.save(); ctx.beginPath();
        let blink = Math.sin(time * 0.1) > 0.96 ? 0.02 : 1.0;
        ctx.ellipse(0, 0, 100, 30 * blink, 0, 0, Math.PI * 2); ctx.clip();
        
        let lx = this.cx + this.sx; let ly = this.cy + this.sy;
        if (isRight) lx = -lx;
        
        // Преломление света внутри алой сферы
        let g = ctx.createRadialGradient(lx, ly, 1, lx, ly, 50);
        g.addColorStop(0, '#000000'); g.addColorStop(0.2, '#140000'); g.addColorStop(0.45, '#540101');
        g.addColorStop(0.7, '#ba0000'); g.addColorStop(0.88, '#ff2e2e'); g.addColorStop(0.96, '#ff8080'); g.addColorStop(1, '#140000');
        ctx.beginPath(); ctx.arc(lx, ly, 42, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        
        // Попиксельная капиллярная структура радужки
        ctx.strokeStyle = 'rgba(240, 0, 0, 0.25)'; ctx.lineWidth = 0.5;
        for (let i = 0; i < 36; i++) {
            let seed = i * 10; ctx.beginPath(); ctx.moveTo(lx, ly);
            ctx.lineTo(lx + Math.cos(seed) * 41, ly + Math.sin(seed) * 41); ctx.stroke();
        }
        
        // Вертикальное лезвие зрачка
        ctx.beginPath(); ctx.ellipse(lx, ly, 3.2 * this.pulse, 28, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#000000'; ctx.fill();
        
        // Двойные глянцевые блики влажной роговицы
        ctx.beginPath(); ctx.arc(lx - 14, ly - 12, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'; ctx.fill();
        ctx.beginPath(); ctx.arc(lx + 18, ly + 6, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; ctx.fill();
        
        ctx.restore(); ctx.restore();
    }
};
