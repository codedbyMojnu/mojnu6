import { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Initializing application...');

  const loadingSteps = [
    { progress: 15, status: "Loading core modules..." },
    { progress: 30, status: "Initializing components..." },
    { progress: 45, status: "Setting up routing..." },
    { progress: 60, status: "Loading game data..." },
    { progress: 75, status: "Preparing UI elements..." },
    { progress: 90, status: "Finalizing setup..." },
    { progress: 100, status: "Ready!" }
  ];

  useEffect(() => {
    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Progress simulation
    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setProgress(step.progress);
        setLoadingStatus(step.status);
        currentStep++;
      } else {
        clearInterval(progressInterval);
      }
    }, 800);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div 
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden animate-fade-in"
      style={{ backgroundImage: "url('/bg-images/notepad.png')" }}
    >
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-2 sm:mx-4">
        <div className="card p-4 sm:p-6 md:p-8 text-center animate-fade-in">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
          <h1 className="text-responsive-lg sm:text-responsive-2xl font-bold text-gray-700 mb-3 sm:mb-4">Loading Application</h1>
          <p className="text-responsive-sm sm:text-responsive-lg text-gray-600 mb-4 sm:mb-6">
            First load takes time, please wait a while{dots}
          </p>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-green rounded-full animate-bounce"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-responsive-xs sm:text-responsive-sm text-gray-600">Loading...</span>
                <span className="text-responsive-xs sm:text-responsive-sm font-semibold text-primary-green">{progress}%</span>
              </div>
              <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-green to-primary-green-hover rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
                    style={{
                      backgroundImage: 'linear-gradient(-45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)',
                      backgroundSize: '20px 20px',
                      animation: 'progressShimmer 1s linear infinite'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6 text-responsive-xs sm:text-responsive-sm text-gray-500">
            <p>{loadingStatus}</p>
            <p className="mt-1">This may take a few moments on first load</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 