
export interface AttentionPoint {
  x: number; // 0-1000
  y: number; // 0-1000
  intensity: number; // 0 to 1
  label: string;
}

export interface AreaOfInterest {
  id: string;
  name: string;
  percentage: number; // 预计获得的注意力百分比
  description: string;
  // [ymin, xmin, ymax, xmax] based on 1000x1000 grid
  boundingBox: [number, number, number, number]; 
  score: number; // 0-10 吸引力评分
}

export interface AnalysisResult {
  attentionPoints: AttentionPoint[];
  summary: string;
  strengths: string[];
  weaknesses: string[];
  accessibilityScore: number;
  clarityScore: number;
  predictionConfidence: number; // 0-100
  aucScore: number; // 新增：模拟 AUC (Area Under Curve) 准确率指标
  aois: AreaOfInterest[];
  recommendations: string[];
}

export interface ProcessingState {
  status: 'idle' | 'uploading' | 'analyzing' | 'completed' | 'error';
  progress: number;
  stage?: string; // 当前分析阶段
  errorMessage?: string;
}
