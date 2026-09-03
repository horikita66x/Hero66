// Модуль генеративной пасти и симуляции челюстей (Abyssal Jaws Module)
window.MouthModule = {
    isLicking: false, lickProgress: 0, timer: 120,

    update: function() {
        if (!this.isLicking) {
            this.timer--;
            if (this.timer <= 0) { this.isLicking = true; this.lickProgress = 0; }
        } else {
            this.lickProgress += 0.032;
            if (this.lickProgress > Math.PI) { this.isLicking = false; this.timer = 200 + Math.random() * 250; }
        }
    },

    render: function(ctx, jawOffset, time) {
        ctx.save();
        ctx.translate(0, 115 + jawOffset);

        // Теневая воронка пищевода
        let mouthGrad = ctx.createRadialGradient(0, 0, 15, 0, 0, 260);
        mouthGrad.addColorStop(0, '#040101');
        mouthGrad.addColorStop(0.5, '#010000');
        mouthGrad.addColorStop(1, '#000000');
        ctx.beginPath();
        ctx.ellipse(0, 0, 220, 68, 0, 0, Math.PI * 2);
        ctx.fillStyle = mouthGrad;
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, 0, 220, 68, 0, 0, Math.PI * 2);
        ctx.clip();

        // Физика натяжения слюны
        let saliva = this.isLicking ? Math.sin(this.lickProgress) * 16 : 0;
        ctx.strokeStyle = 'rgba(130, 8, 8, 0.18)';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(-190, -45); ctx.bezierCurveTo(-170, -20 + saliva, -175, 20, -170, 45); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(190, -45); ctx.bezierCurveTo(160, -20 + saliva, 170, 20, 170, 45); ctx.stroke();

        // Симуляция генеративного языка (Процедурное мясо)
        if (this.isLicking) {
            let ty = Math.sin(this.lickProgress) * -45;
            let tx = Math.cos(this.lickProgress * 2) * 58;

            let tongueGrad = ctx.createLinearGradient(tx, ty + 65, tx, ty - 25);
            tongueGrad.addColorStop(0, '#0f0000');
            tongueGrad.addColorStop(0.3, '#420101');
            tongueGrad.addColorStop(0.65, '#910202');
            tongueGrad.addColorStop(0.9, '#db0404');
            tongueGrad.addColorStop(1, '#ff4747');

            ctx.beginPath();
            ctx.ellipse(tx, ty + 38, 68, 44, Math.cos(this.lickProgress) * 0.28, 0, Math.PI * 2);
            ctx.fillStyle = tongueGrad;
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 18;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Текстурный шов языка
            ctx.beginPath();
            ctx.ellipse(tx, ty + 22, 2.5, 32, Math.cos(this.lickProgress) * 0.28, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.fill();
        }

        // Рендеринг костяной структуры челюстей
        this.renderTeeth(ctx, false); // Верхняя
        this.renderTeeth(ctx, true);  // Нижняя

        ctx.restore();
        ctx.restore();
    },

    renderTeeth: function(ctx, isLower) {
        ctx.save();
        if (isLower) ctx.transform(1, 0, 0, -1, 0, 0);

        // 3D Матрица индивидуальных параметров для каждого из 24 клыков
        let teeth = [
            {x: -180, h: 18, w: 8, f: false}, {x: -155, h: 38, w: 13, f: true}, {x: -130, h: 25, w: 10, f: false},
            {x: -105, h: 22, w: 9, f: false}, {x: -80, h: 46, w: 14, f: true},  {x: -55, h: 28, w: 10, f: false},
            {x: -30, h: 25, w: 9, f: false},  {x: -5, h: 23, w: 8, f: false},   {x: 20, h: 25, w: 9, f: false},
            {x: 45, h: 46, w: 14, f: true},   {x: 70, h: 22, w: 9, f: false},   {x: 95, h: 25, w: 10, f: false},
            {x: 120, h: 38, w: 13, f: true},  {x: 145, h: 18, w: 8, f: false}
        ];

        teeth.forEach((t) => {
            ctx.save();
            ctx.translate(t.x, -58);

            // Тень кости в пасти
            ctx.beginPath();
            ctx.moveTo(-t.w - 3, 0); ctx.lineTo(0, t.h + 4); ctx.lineTo(t.w + 3, 0);
            ctx.fillStyle = 'rgba(0,0,0,0.98)';
            ctx.fill();

            // Слой 1: Основание (костяной налет)
            ctx.beginPath();
            ctx.moveTo(-t.w, 0); ctx.lineTo(0, t.h); ctx.lineTo(t.w, 0);
            ctx.fillStyle = t.f ? '#24231e' : '#1c1b18';
            ctx.fill();

            // Слой 2: Полутона кости
            ctx.beginPath();
            ctx.moveTo(-t.w + 1.8, 0); ctx.lineTo(0, t.h - 2); ctx.lineTo(t.w - 1.8, 0);
            ctx.fillStyle = t.f ? '#545249' : '#45433d';
            ctx.fill();

            // Слой 3: Остриё и сколы эмали
            ctx.beginPath();
            ctx.moveTo(-t.w + 3.8, 0); ctx.lineTo(0, t.h - 4.5); ctx.lineTo(t.w - 3.8, 0);
            ctx.fillStyle = t.f ? '#9e9987' : '#827f72';
            ctx.fill();

            ctx.restore();
        });

        ctx.restore();
    }
};
          
