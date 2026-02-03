// components/popup/VideoGenerationPopup.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, Palette, Wand2 } from 'lucide-react';

interface VideoGenerationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: { prompt: string; duration: number; style: string }) => void;
  selectedFrameId?: string | null;
}

const VideoGenerationPopup: React.FC<VideoGenerationPopupProps> = ({
  isOpen,
  onClose,
  onGenerate,
  selectedFrameId
}) => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(10);
  const [style, setStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);

  // Сброс формы при открытии
  useEffect(() => {
    if (isOpen) {
      setPrompt('');
      setDuration(10);
      setStyle('realistic');
      setIsGenerating(false);
    }
  }, [isOpen]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    onGenerate({ 
      prompt, 
      duration, 
      style 
    });
  };

  const styles = [
    { id: 'realistic', name: 'Realistic', icon: '🎬', description: 'Photorealistic video' },
    { id: 'cartoon', name: 'Cartoon', icon: '🖼️', description: 'Animated cartoon style' },
    { id: 'abstract', name: 'Abstract', icon: '🎨', description: 'Artistic abstract visuals' },
    { id: 'cinematic', name: 'Cinematic', icon: '🎥', description: 'Movie-like quality' },
    { id: 'anime', name: 'Anime', icon: '🌸', description: 'Japanese animation style' },
    { id: 'painting', name: 'Painting', icon: '🖌️', description: 'Oil painting effect' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex">
      {/* Overlay для закрытия по клику вне popup */}
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      
      {/* Popup sidebar */}
      <div 
        className="relative h-full bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out"
        style={{ width: '340px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                AI Video Generator
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Frame #{selectedFrameId?.slice(-6)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Prompt Section */}
          <div>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                <span className="text-blue-600 dark:text-blue-300 text-sm">1</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Describe your video
              </h3>
            </div>
            <textarea
              className="w-full h-32 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Example: A peaceful mountain landscape at sunset with flowing river..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Be as detailed as possible for better results
            </p>
          </div>

          {/* Duration Section */}
          <div>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2">
                <span className="text-purple-600 dark:text-purple-300 text-sm">2</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Video Duration
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Length</span>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{duration}s</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                step="1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Short (1s)</span>
                <span>Medium (30s)</span>
                <span>Long (60s)</span>
              </div>
            </div>
          </div>

          {/* Style Section */}
          <div>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                <span className="text-green-600 dark:text-green-300 text-sm">3</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Visual Style
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {styles.map((styleOption) => (
                <button
                  key={styleOption.id}
                  className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                    style === styleOption.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md transform scale-[1.02]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  onClick={() => setStyle(styleOption.id)}
                >
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{styleOption.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {styleOption.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {styleOption.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border border-blue-200 dark:border-gray-700 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2" />
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                Pro Tips for Best Results
              </h4>
            </div>
            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 mr-2"></span>
                <span>Include camera movements: "zoom in", "pan left", "slow motion"</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 mr-2"></span>
                <span>Describe lighting: "golden hour", "dramatic shadows", "soft glow"</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 mr-2"></span>
                <span>Specify mood: "epic", "calm", "mysterious", "joyful"</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Generating Video...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-3" />
                Generate AI Video
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
            Usually takes 30-90 seconds. The video will appear in your frame.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerationPopup;