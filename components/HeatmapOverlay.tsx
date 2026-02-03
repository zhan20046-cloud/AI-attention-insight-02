
import React, { useRef, useEffect } from 'react';
import { AttentionPoint } from '../types';

interface HeatmapOverlayProps {
  points: AttentionPoint[];
  visible: boolean;
  showMarkers: boolean;
}

const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ points, visible, showMarkers }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 安全检查：如果数据为空或不可见，直接返回
      if (!visible || !points || points.length === 0) return;

      const renderWidth = canvas.width;
      const renderHeight = canvas.height;

      // 防止除以零或负数
      const scaleFactor = renderWidth > 0 ? renderWidth / 1000 : 0.5;
      // 确保半径始终为正数，防止 createRadialGradient 报错
      const radius = Math.max(1, 135 * scaleFactor); 
      const baseIntensity = 0.45; 

      // 创建临时画布
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = Math.max(1, renderWidth);
      tempCanvas.height = Math.max(1, renderHeight);
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

      if (!tempCtx) return;

      // 绘制能量场
      points.forEach(point => {
        // 容错处理：确保坐标是数字
        const px = Number(point.x) || 0;
        const py = Number(point.y) || 0;
        const pintensity = Number(point.intensity) || 0;

        const x = (px / 1000) * renderWidth;
        const y = (py / 1000) * renderHeight;
        
        const val = Math.min(pintensity * baseIntensity, 0.75);

        try {
            const gradient = tempCtx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, `rgba(0, 0, 0, ${val})`);
            gradient.addColorStop(0.4, `rgba(0, 0, 0, ${val * 0.6})`); 
            gradient.addColorStop(0.8, `rgba(0, 0, 0, ${val * 0.15})`); 
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            tempCtx.fillStyle = gradient;
            tempCtx.globalCompositeOperation = 'screen'; 
            tempCtx.fillRect(0, 0, renderWidth, renderHeight);
        } catch (gradErr) {
            // 忽略单个点的绘制错误
        }
      });

      const imageData = tempCtx.getImageData(0, 0, renderWidth, renderHeight);
      const data = imageData.data;

      // 颜色映射函数
      const getColor = (v: number) => {
        if (v < 10) return [0, 0, 255, v * 0.005];
        
        const stops = [
          { t: 0,   color: [0, 0, 255, 0] },
          { t: 10,  color: [0, 0, 255, 0.05] },
          { t: 30,  color: [0, 180, 255, 0.2] },
          { t: 60,  color: [0, 255, 128, 0.4] },
          { t: 100, color: [255, 255, 0, 0.6] },
          { t: 150, color: [255, 160, 0, 0.75] },
          { t: 200, color: [255, 50, 50, 0.85] },
          { t: 255, color: [255, 0, 0, 0.9] }
        ];

        for (let i = 0; i < stops.length - 1; i++) {
          if (v >= stops[i].t && v <= stops[i+1].t) {
            const range = stops[i+1].t - stops[i].t;
            const rangePct = (v - stops[i].t) / range;
            const c1 = stops[i].color;
            const c2 = stops[i+1].color;
            return [
              c1[0] + (c2[0] - c1[0]) * rangePct,
              c1[1] + (c2[1] - c1[1]) * rangePct,
              c1[2] + (c2[2] - c1[2]) * rangePct,
              c1[3] + (c2[3] - c1[3]) * rangePct,
            ];
          }
        }
        return stops[stops.length-1].color;
      };

      for (let i = 0; i < data.length; i += 4) {
        const energy = data[i + 3];
        if (energy > 5) { 
          const [r, g, b, a] = getColor(energy);
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = Math.min(255, a * 255); 
        } else {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // 绘制标记点
      if (showMarkers) {
        points.forEach((point, i) => {
          const px = Number(point.x) || 0;
          const py = Number(point.y) || 0;
          const pintensity = Number(point.intensity) || 0;

          const x = (px / 1000) * renderWidth;
          const y = (py / 1000) * renderHeight;

          const isImportant = pintensity > 0.5;
          const markerSize = (isImportant ? 10 : 6) * (renderWidth / 500); 
          
          ctx.beginPath();
          ctx.arc(x, y, markerSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fill();
          ctx.strokeStyle = '#4f46e5';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          if (isImportant) {
              ctx.font = `bold ${9 * (renderWidth/500)}px Inter`;
              ctx.fillStyle = '#4f46e5';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText((i + 1).toString(), x, y);
          }

          if (point.label && pintensity > 0.6) {
            const fontSize = Math.max(10, 11 * (renderWidth/500));
            ctx.font = `bold ${fontSize}px Inter`;
            const labelText = point.label || '';
            const tw = ctx.measureText(labelText).width;
            const boxX = x + 12;
            const boxY = y - 10;
            const boxW = tw + 8;
            const boxH = fontSize * 1.8;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.beginPath();
            ctx.rect(boxX, boxY, boxW, boxH); 
            ctx.fill();
            
            ctx.fillStyle = '#1e1b4b';
            ctx.textAlign = 'left';
            ctx.fillText(labelText, x + 16, y + 4);
          }
        });
      }
    } catch (e) {
        console.error("Canvas rendering failed", e);
        // 不抛出错误，防止页面崩溃
    }

  }, [points, visible, showMarkers]);

  return (
    <canvas 
      ref={canvasRef}
      width={500}  
      height={1000} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'normal' }}
    />
  );
};

export default HeatmapOverlay;
