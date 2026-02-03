import React, { useState } from 'react';
import { Upload, HeatMap, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/genai';

const App = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // 图片上传
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setResult(null);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  // AI分析
  const analyzeImage = async () => {
    if (!image) {
      setError('请先上传设计图');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY'); // 替换成你的API Key
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `分析这张移动端设计图的用户注意力热图，给出3条优化建议，格式为：
1. 建议1
2. 建议2
3. 建议3`;

      const aiResult = await model.generateContent([
        prompt,
        { inlineData: { mimeType: 'image/png', data: image.split(',')[1] } }
      ]);
      setResult((await aiResult.response).text());
    } catch (err) {
      setError('分析失败，请检查API Key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 flex items-center justify-center gap-2">
          <HeatMap size={28} />
          视界分析 AI
        </h1>
        <p className="text-gray-500 mt-2">移动端设计注意力热图分析工具</p>
      </header>

      <main className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">上传设计图</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            {!image ? (
              <>
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">点击或拖拽文件至此处上传</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  选择文件
                </label>
              </>
            ) : (
              <>
                <img
                  src={image}
                  alt="设计图预览"
                  className="max-w-full max-h-60 mx-auto rounded-md mb-4"
                />
                <button
                  onClick={() => setImage(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  重新上传
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <button
            onClick={analyzeImage}
            disabled={loading || !image}
            className="w-full mt-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                分析中...
              </>
            ) : (
              "生成热图分析"
            )}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">分析结果</h2>
          <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-400">
            {result ? (
              <div className="text-left w-full text-gray-700 whitespace-pre-line">
                {result}
              </div>
            ) : (
              <div className="text-center">
                <HeatMap size={64} className="mx-auto mb-4" />
                <p>上传设计图并点击分析按钮查看结果</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto mt-12 text-center text-gray-500 text-sm">
        © 2026 视界分析 AI - 基于Google Gemini AI开发
      </footer>
    </div>
  );
};

export default App;
