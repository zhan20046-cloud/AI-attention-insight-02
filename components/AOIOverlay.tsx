
import React from 'react';
import { AreaOfInterest } from '../types';

interface AOIOverlayProps {
  aois: AreaOfInterest[];
  visible: boolean;
}

const AOIOverlay: React.FC<AOIOverlayProps> = ({ aois, visible }) => {
  if (!visible || !aois || !Array.isArray(aois) || aois.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        {aois.map((aoi, idx) => {
          // 极致防御：确保 boundingBox 存在且全为有效数字
          if (
            !aoi.boundingBox || 
            !Array.isArray(aoi.boundingBox) || 
            aoi.boundingBox.length !== 4 ||
            aoi.boundingBox.some(n => typeof n !== 'number' || isNaN(n))
          ) {
            return null;
          }
          
          const [ymin, xmin, ymax, xmax] = aoi.boundingBox;
          
          // 防止坐标反转或无效尺寸
          const width = Math.max(0, xmax - xmin);
          const height = Math.max(0, ymax - ymin);
          
          if (width === 0 || height === 0) return null;

          return (
            <g key={idx} className="group pointer-events-auto cursor-help">
              {/* 区域背景 - 悬停时加深 */}
              <rect
                x={xmin}
                y={ymin}
                width={width}
                height={height}
                fill="rgba(79, 70, 229, 0.1)"
                stroke="#4f46e5"
                strokeWidth="2"
                strokeDasharray="8 4"
                className="transition-all duration-300 group-hover:fill-[rgba(79,70,229,0.25)] group-hover:stroke-width-3"
              />
              
              {/* 左上角标签 */}
              <foreignObject x={xmin} y={ymin - 35} width={300} height={40}>
                 <div className="flex gap-2">
                    <div className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                      <span>{aoi.name}</span>
                      <span className="bg-white/20 px-1 rounded text-white">{aoi.percentage}%</span>
                    </div>
                 </div>
              </foreignObject>

              {/* 右下角得分 - 仅悬停显示详细 */}
              <foreignObject x={xmax - 40} y={ymax - 20} width={100} height={30}>
                 <div className="flex justify-end">
                    <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                       Score: {aoi.score}
                    </div>
                 </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default AOIOverlay;
