
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AreaOfInterest, AttentionPoint } from "./types";

// Initialize GoogleGenAI with API key from environment variable as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUIHeatmap = async (base64Image: string): Promise<AnalysisResult> => {
  const model = 'gemini-3-pro-preview';

  const prompt = `
    Role: You are the "VisionCore v4.0" Engine.

    Task:
    Analyze the provided mobile UI design and generate a predictive eye-tracking report.

    Requirements:
    1.  **Precision Heatmap:** Generate **50** high-confidence fixation points (x,y on 1000x1000 grid).
    2.  **Quantified Areas of Interest (AOI):** Identify 3-5 key Areas of Interest with boundingBox [ymin, xmin, ymax, xmax] (0-1000 scale).
    3.  **Metrics:** Prediction Confidence, AUC Score.

    Language: Return JSON only. Text fields in Chinese.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Image.split(',')[1] || base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            attentionPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  intensity: { type: Type.NUMBER },
                  label: { type: Type.STRING }
                },
                required: ["x", "y", "intensity", "label"]
              }
            },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            accessibilityScore: { type: Type.NUMBER },
            clarityScore: { type: Type.NUMBER },
            predictionConfidence: { type: Type.NUMBER },
            aucScore: { type: Type.NUMBER, description: "Simulated Area Under Curve score vs human ground truth" },
            aois: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  percentage: { type: Type.NUMBER },
                  score: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  boundingBox: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    description: "[ymin, xmin, ymax, xmax] normalized 0-1000"
                  }
                },
                required: ["name", "percentage", "description", "boundingBox", "score"]
              }
            },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["attentionPoints", "summary", "strengths", "weaknesses", "accessibilityScore", "clarityScore", "predictionConfidence", "aucScore", "aois", "recommendations"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("AI 响应内容为空");

    // 1. 增强型 JSON 提取：查找第一个 '{' 和最后一个 '}'，忽略其他所有文本
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("无法从 AI 响应中提取有效的 JSON 对象");
    }
    const cleanJsonStr = jsonMatch[0];

    try {
      const parsed = JSON.parse(cleanJsonStr);
      
      // 2. 深度数据清洗与类型强制转换 (Deep Sanitization)
      // 这一步确保即使 JSON 字段类型错误（如字符串数字），也不会导致前端崩溃
      
      const safePoints: AttentionPoint[] = Array.isArray(parsed.attentionPoints) 
        ? parsed.attentionPoints
            .map((p: any) => ({
              x: Number(p.x) || 0,
              y: Number(p.y) || 0,
              intensity: Number(p.intensity) || 0,
              label: String(p.label || '')
            }))
            .filter((p: AttentionPoint) => !isNaN(p.x) && !isNaN(p.y)) // 过滤无效坐标
        : [];

      const safeAois: AreaOfInterest[] = Array.isArray(parsed.aois)
        ? parsed.aois
            .map((a: any) => {
               // 确保 boundingBox 是 4 个数字的数组
               let box = [0,0,0,0];
               if (Array.isArray(a.boundingBox) && a.boundingBox.length === 4) {
                 box = a.boundingBox.map((n: any) => Number(n) || 0);
               }
               return {
                 id: String(a.id || Math.random().toString()),
                 name: String(a.name || 'Unknown Area'),
                 percentage: Number(a.percentage) || 0,
                 score: Number(a.score) || 0,
                 description: String(a.description || ''),
                 boundingBox: box as [number, number, number, number]
               };
            })
        : [];

      // 3. 构建安全的返回对象
      const result: AnalysisResult = {
        attentionPoints: safePoints,
        aois: safeAois,
        summary: String(parsed.summary || '无概要'),
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.map(String) : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.map(String) : [],
        accessibilityScore: Number(parsed.accessibilityScore) || 0,
        clarityScore: Number(parsed.clarityScore) || 0,
        predictionConfidence: Number(parsed.predictionConfidence) || 0,
        aucScore: Number(parsed.aucScore) || 0.85
      };

      return result;

    } catch (e) {
      console.error("数据清洗失败:", e);
      console.error("原始 JSON:", cleanJsonStr);
      throw new Error("AI 返回数据结构异常，无法解析");
    }

  } catch (error) {
    console.error("Gemini Critical Error:", error);
    throw error;
  }
};