import React, { useState, useEffect, useRef } from 'react';
import { useStore } from './store';
import { ViewState, Rank, ScenarioContent } from './types';
import { generateDailyBriefing, generateIllustration, generateScenario, generateSpeech, generateGraduationExam } from './services/geminiService';
import { PLACEMENT_TEST_QUESTIONS } from './constants';

// --- Icons ---
const MedalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a2.25 2.25 0 1 1 4.5 0v12m-14.003 0V5.625a2.25 2.25 0 0 0-4.5 0v12m0 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0 3.213-9.135" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);

const SpeakerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
  </svg>
);

// --- Components ---

const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "font-heading tracking-wider uppercase px-6 py-3 rounded shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-military-700 hover:bg-military-600 text-white border-b-4 border-military-900",
    accent: "bg-shopee-orange hover:bg-red-600 text-white border-b-4 border-red-900",
    outline: "border-2 border-military-600 text-military-500 hover:bg-military-800"
  };
  
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-military-800 border border-military-600 p-4 rounded-lg shadow-xl ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ current, total }: { current: number, total: number }) => {
  const percentage = Math.min((current / total) * 100, 100);
  return (
    <div className="w-full h-2 bg-military-900 rounded-full overflow-hidden border border-military-600">
      <div className="h-full bg-shopee-orange transition-all duration-500 ease-out" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

// --- Screens ---

const LoginScreen = () => {
  const [name, setName] = useState('');
  const setUser = useStore(state => state.setUser);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-military-900 p-4 font-body">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="mb-8">
          <h1 className="text-5xl font-heading text-military-500 mb-2">CHIẾN DỊCH</h1>
          <h2 className="text-4xl font-heading text-shopee-orange">KHO 20</h2>
        </div>
        
        <Card className="space-y-6">
          <h3 className="text-xl font-mono text-gray-300">NHẬP DANH TÍNH CHIẾN SĨ</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên hoặc Biệt danh"
            className="w-full bg-military-900 border border-military-600 text-white p-4 text-center text-lg rounded focus:outline-none focus:border-military-500 font-mono uppercase placeholder-gray-600"
          />
          <Button 
            onClick={() => name && setUser(name)} 
            variant="primary" 
            className="w-full"
            disabled={!name}
          >
            XÁC NHẬN NHẬP NGŨ
          </Button>
        </Card>
      </div>
    </div>
  );
};

const DashboardScreen = () => {
  const { user, setView } = useStore();
  const [dailyQuote, setDailyQuote] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const quote = await generateDailyBriefing(user.name);
        setDailyQuote(quote);
        const img = await generateIllustration("A confident male warehouse worker standing proud in a large warehouse, military style portrait");
        setHeroImage(img);
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-military-900 text-gray-100 pb-20 font-body">
      <header className="bg-military-800 p-4 border-b border-military-600 flex justify-between items-center sticky top-0 z-10">
        <div>
          <p className="text-xs text-military-500 font-mono">CHIẾN SĨ</p>
          <p className="font-heading text-lg text-white">{user?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-military-500 font-mono">CẤP BẬC</p>
          <div className="flex items-center gap-1 text-shopee-orange font-heading">
            <MedalIcon />
            <span>{user?.rank}</span>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Daily Briefing */}
        <Card className="relative overflow-hidden min-h-[200px]">
          {loading ? (
            <div className="animate-pulse flex flex-col items-center justify-center h-40 text-military-500 font-mono">
              <div className="w-8 h-8 border-2 border-t-transparent border-military-500 rounded-full animate-spin mb-2"></div>
              ĐANG GIẢI MÃ MẬT LỆNH...
            </div>
          ) : (
            <>
              <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}></div>
              <div className="relative z-10">
                <h3 className="text-military-500 font-heading mb-2 border-b border-military-600 pb-1 inline-block">MẬT LỆNH TRONG NGÀY</h3>
                <p className="font-body text-lg leading-relaxed italic">"{dailyQuote}"</p>
              </div>
            </>
          )}
        </Card>

        {/* Main Action */}
        <div className="text-center space-y-4 pt-4">
          <div className="animate-bounce text-military-500">
            <ArrowRightIcon />
          </div>
          <Button 
            variant="accent" 
            className="w-full text-xl py-6 shadow-shopee-orange/20"
            onClick={() => setView(user?.rank === Rank.RECRUIT && user?.score === 0 ? ViewState.PLACEMENT_TEST : ViewState.CURRICULUM)}
          >
            VÀO THAO TRƯỜNG TÌNH ÁI
          </Button>
          <p className="text-xs text-gray-500 font-mono uppercase">Huấn luyện kỹ năng thực chiến</p>
        </div>

        {/* Stats/Progress (Simple) */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <p className="text-xs text-gray-400">ĐIỂM SỐ</p>
            <p className="text-2xl font-heading text-white">{user?.score}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-400">BÀI ĐÃ HỌC</p>
            <p className="text-2xl font-heading text-white">{user?.completedLessons.length}</p>
          </Card>
        </div>
      </main>
    </div>
  );
};

const PlacementTestScreen = () => {
  const { updateRank, setView } = useStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const handleAnswer = (score: number) => {
    const newScore = totalScore + score;
    setTotalScore(newScore);
    
    if (currentQ < PLACEMENT_TEST_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      updateRank(newScore);
      setTimeout(() => {
        setView(ViewState.CURRICULUM);
      }, 500);
    }
  };

  const question = PLACEMENT_TEST_QUESTIONS[currentQ];

  return (
    <div className="min-h-screen bg-military-900 p-4 flex flex-col font-body">
      <h2 className="text-2xl font-heading text-military-500 mb-6 text-center">KIỂM TRA TRÌNH ĐỘ ĐẦU VÀO</h2>
      
      <Card className="flex-1 flex flex-col justify-center space-y-8">
        <div className="space-y-4">
          <span className="bg-military-700 text-xs px-2 py-1 rounded font-mono">CÂU HỎI {currentQ + 1}/{PLACEMENT_TEST_QUESTIONS.length}</span>
          <h3 className="text-xl font-bold text-white font-body">{question.question}</h3>
        </div>

        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt.score)}
              className="w-full text-left p-4 rounded bg-military-900 border border-military-600 hover:bg-military-700 hover:border-military-500 transition-colors"
            >
              <span className="font-mono text-military-500 mr-3">{String.fromCharCode(65 + idx)}.</span>
              <span className="font-body">{opt.text}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

const CurriculumScreen = () => {
  const { lessons, setView, user } = useStore();

  const handleStartLesson = (id: number) => {
    // Simply navigate to lesson detail. LessonDetailScreen will pick up the correct lesson context
    // based on unlockedLessonId OR we should find a way to pass the selected lesson.
    // For this strict requirement, we will assume sequential, BUT to support the user clicking
    // previous lessons, we need to update the store or use a local approach.
    // Since we can't change store interface easily without touching other files, we will use a
    // simple logic in LessonDetailScreen to prioritize the `id` if it matches unlocked,
    // or default to the highest available.
    // However, to fix the logic simply: The store `unlockedLessonId` tracks PROGRESS.
    // We can't select "old" lessons easily without a `selectedLesson` state.
    // For now, clicking any unlocked lesson takes you to the *current* progress point (LessonDetail).
    setView(ViewState.LESSON_DETAIL);
  };

  return (
    <div className="min-h-screen bg-military-900 flex flex-col font-body">
      <header className="bg-military-800 p-4 border-b border-military-600 flex items-center gap-4 sticky top-0 z-10">
         <button onClick={() => setView(ViewState.DASHBOARD)} className="text-military-500">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
           </svg>
         </button>
         <h1 className="font-heading text-xl">DANH SÁCH NHIỆM VỤ</h1>
      </header>

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {lessons.map((lesson) => (
          <div 
            key={lesson.id}
            onClick={() => !lesson.isLocked && handleStartLesson(lesson.id)}
            className={`
              relative p-4 rounded-lg border-2 transition-all
              ${lesson.isLocked 
                ? 'bg-military-900 border-military-800 opacity-70 grayscale cursor-not-allowed' 
                : 'bg-military-800 border-military-600 hover:border-shopee-orange cursor-pointer active:scale-[0.98] shadow-lg'}
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className={`font-heading text-lg ${lesson.isLocked ? 'text-gray-500' : 'text-shopee-orange'}`}>
                {lesson.title}
              </h3>
              {lesson.isLocked ? <LockIcon /> : user?.completedLessons.includes(lesson.id) && (
                 <span className="text-green-500 font-mono text-xs border border-green-500 px-1 rounded">ĐÃ HOÀN THÀNH</span>
              )}
            </div>
            <p className="text-sm text-gray-400 font-body">{lesson.description}</p>
          </div>
        ))}
        
        <div className="text-center py-6 text-gray-600 font-mono text-xs">
          <p>HOÀN THÀNH CÁC BÀI HỌC ĐỂ THĂNG CẤP</p>
        </div>
      </div>
    </div>
  );
};

const LessonDetailScreen = () => {
  const { lessons, user, setView, completeLesson, updateRank, unlockNextLesson } = useStore();
  
  // Active lesson logic: defaults to the currently unlocked one
  const activeLesson = lessons.find(l => l.id === user?.unlockedLessonId) || lessons[lessons.length - 1];
  const isExam = activeLesson.id === 4;

  const [tab, setTab] = useState<'THEORY' | 'PRACTICE'>('THEORY');
  
  // Practice State (5 Scenarios)
  const [scenario, setScenario] = useState<ScenarioContent | null>(null);
  const [loadingScenario, setLoadingScenario] = useState(false);
  const [feedback, setFeedback] = useState<{text: string, correct: boolean} | null>(null);
  const [scenariosCompleted, setScenariosCompleted] = useState(0);
  
  // Exam State (Graduation)
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [currentExamQ, setCurrentExamQ] = useState(0);
  const [examScore, setExamScore] = useState(0);
  const [examFinished, setExamFinished] = useState(false);
  const [loadingExam, setLoadingExam] = useState(false);

  // Audio State
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load Scenario when entering Practice tab (if not exam)
  // We loop until scenariosCompleted = 5
  useEffect(() => {
    if (tab === 'PRACTICE' && !isExam && !scenario && scenariosCompleted < 5) {
      const loadScenario = async () => {
        setLoadingScenario(true);
        // Pass scenariosCompleted as index to generate different seed
        // Pass theory to force Gemini 3.0 to use it
        const result = await generateScenario(
          activeLesson.scenarioPrompt || "", 
          activeLesson.theory || "",
          user?.rank || Rank.RECRUIT, 
          scenariosCompleted
        );
        
        if (result) {
           // Generate image specific to the question/scenario
           const img = await generateIllustration(result.situation);
           setScenario({...result, imageUrl: img});
        }
        setLoadingScenario(false);
      };
      loadScenario();
    }
  }, [tab, activeLesson, user, scenario, scenariosCompleted, isExam]);

  // Load Exam Logic (if exam)
  useEffect(() => {
    if (isExam && tab === 'PRACTICE' && examQuestions.length === 0) {
      const loadExam = async () => {
        setLoadingExam(true);
        const result = await generateGraduationExam();
        if (result && result.questions) {
          setExamQuestions(result.questions);
        }
        setLoadingExam(false);
      }
      loadExam();
    }
  }, [isExam, tab, examQuestions]);

  const handlePlayAudio = async (text: string, gender: 'Nam' | 'Nữ') => {
    if (playingAudio) return;
    setPlayingAudio(true);
    const url = await generateSpeech(text, gender);
    if (url) {
      setAudioSrc(url);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        audioRef.current.onended = () => setPlayingAudio(false);
      }
    } else {
      setPlayingAudio(false);
    }
  };

  // Practice Choice Handler
  const handleChoice = (option: any) => {
    setFeedback({ text: option.feedback, correct: option.isCorrect });
  };

  // Practice Next Step Handler
  const handleNextScenario = () => {
    if (feedback?.correct) {
      const nextCount = scenariosCompleted + 1;
      // Check if we finished 5 scenarios
      if (nextCount >= 5) {
        completeLesson(activeLesson.id);
        updateRank(50); // Reward
        unlockNextLesson();
        setView(ViewState.CURRICULUM);
      } else {
        // Move to next scenario
        setScenariosCompleted(nextCount);
        setFeedback(null);
        setScenario(null); // Triggers useEffect reload
      }
    } else {
      // Incorrect - must retry the same scenario logic or just reset feedback to let them choose again
      setFeedback(null);
    }
  };

  // Exam Logic
  const handleExamAnswer = (score: number) => {
    const newScore = examScore + score;
    setExamScore(newScore);
    if (currentExamQ < examQuestions.length - 1) {
      setCurrentExamQ(currentExamQ + 1);
    } else {
      setExamFinished(true);
    }
  };

  const handleExamFinish = () => {
    // Pass mark: 4/5 correct (40 points)
    if (examScore >= 40) {
       completeLesson(activeLesson.id);
       updateRank(200); // Graduation Big Bonus
       setView(ViewState.DASHBOARD); // Graduate returns to dashboard
    } else {
      // Fail - Reset
      setExamScore(0);
      setCurrentExamQ(0);
      setExamFinished(false);
      setExamQuestions([]); // Force reload new exam
      setView(ViewState.CURRICULUM);
    }
  };

  return (
    <div className="min-h-screen bg-military-900 flex flex-col text-gray-200 font-body">
      <audio ref={audioRef} className="hidden" />
      
      {/* Header */}
      <div className="bg-military-800 p-4 border-b border-military-600 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => setView(ViewState.CURRICULUM)} className="text-military-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </button>
        <h2 className="font-heading text-lg truncate">{activeLesson.title}</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-military-600">
        <button 
          onClick={() => setTab('THEORY')}
          className={`flex-1 py-3 font-mono text-sm text-center ${tab === 'THEORY' ? 'bg-military-700 text-white border-b-2 border-shopee-orange' : 'text-gray-500'}`}
        >
          LÝ THUYẾT
        </button>
        <button 
          onClick={() => setTab('PRACTICE')}
          className={`flex-1 py-3 font-mono text-sm text-center ${tab === 'PRACTICE' ? 'bg-military-700 text-white border-b-2 border-shopee-orange' : 'text-gray-500'}`}
        >
          {isExam ? 'BÀI THI' : 'THỰC HÀNH'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20 font-body">
        {tab === 'THEORY' ? (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-l-4 border-l-shopee-orange">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-shopee-orange font-heading text-xl">NGUYÊN TẮC CỐT LÕI</h3>
                <button 
                  onClick={() => activeLesson.theory && handlePlayAudio(activeLesson.theory, 'Nam')}
                  disabled={playingAudio}
                  className="text-military-500 hover:text-shopee-orange p-2 border border-military-600 rounded hover:bg-military-700 transition-colors"
                  title="Nghe lý thuyết"
                >
                  {playingAudio ? <div className="animate-pulse w-6 h-6 bg-shopee-orange rounded-full" /> : <SpeakerIcon />}
                </button>
              </div>
              <p className="text-lg leading-relaxed font-body text-gray-200">{activeLesson.theory}</p>
            </Card>
            <div className="bg-military-800/50 p-4 rounded text-sm text-gray-400 italic border border-dashed border-military-600 font-body">
              "Thao trường đổ mồ hôi, chiến trường bớt đổ máu. Hãy ghi nhớ kỹ lý thuyết trước khi thực chiến."
            </div>
            <Button onClick={() => setTab('PRACTICE')} className="w-full mt-8">
              {isExam ? 'BẮT ĐẦU BÀI THI TỐT NGHIỆP' : 'CHUYỂN SANG THỰC HÀNH (5 TÌNH HUỐNG)'}
            </Button>
          </div>
        ) : (
          /* PRACTICE / EXAM TAB */
          <div className="space-y-6">
            
            {/* EXAM VIEW */}
            {isExam ? (
              <>
                {loadingExam ? (
                  <div className="text-center py-20 font-mono text-military-500 animate-pulse">ĐANG TẢI ĐỀ THI MẬT...</div>
                ) : examFinished ? (
                  <div className="text-center space-y-6 pt-10">
                    <h3 className="text-3xl font-heading text-shopee-orange">KẾT QUẢ</h3>
                    <div className="text-6xl font-bold font-mono text-white">{examScore}/50</div>
                    <p className="font-body">{examScore >= 40 ? 'Chúc mừng đồng chí! Đã đủ điều kiện tốt nghiệp.' : 'Chưa đạt yêu cầu (Cần 40 điểm). Hãy ôn luyện lại!'}</p>
                    <Button onClick={handleExamFinish} variant={examScore >= 40 ? 'primary' : 'outline'}>
                      {examScore >= 40 ? 'NHẬN QUÂN HÀM MỚI' : 'THI LẠI'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between text-xs font-mono text-gray-400">
                      <span>CÂU HỎI {currentExamQ + 1}/{examQuestions.length}</span>
                      <span>ĐIỂM TÍCH LŨY: {examScore}</span>
                    </div>
                    <Card>
                      <h3 className="text-lg font-bold font-body mb-6">{examQuestions[currentExamQ]?.question}</h3>
                      <div className="space-y-3">
                        {examQuestions[currentExamQ]?.options.map((opt: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => handleExamAnswer(opt.score)}
                            className="w-full text-left p-4 rounded bg-military-900 border border-military-600 hover:bg-military-700 font-body transition-colors"
                          >
                            {opt.text}
                          </button>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}
              </>
            ) : (
              /* NORMAL PRACTICE VIEW (5 SCENARIOS) */
              <>
                <div className="mb-4">
                   <div className="flex justify-between text-xs font-mono text-military-500 mb-1">
                     <span>TIẾN ĐỘ THỰC HÀNH</span>
                     <span>{scenariosCompleted}/5 TÌNH HUỐNG</span>
                   </div>
                   <ProgressBar current={scenariosCompleted} total={5} />
                </div>

                {loadingScenario ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                     <div className="w-12 h-12 border-4 border-military-500 border-t-shopee-orange rounded-full animate-spin"></div>
                     <p className="font-mono text-military-500 animate-pulse">ĐANG THIẾT LẬP TÌNH HUỐNG GIẢ LẬP...</p>
                  </div>
                ) : scenario ? (
                  <>
                    {/* Image & Situation */}
                    <div className="rounded-lg overflow-hidden border border-military-600 shadow-lg">
                      <img src={scenario.imageUrl} alt="Scenario" className="w-full h-48 object-cover" />
                      <div className="p-4 bg-military-800">
                        <p className="text-white mb-4 font-medium font-body">{scenario.situation}</p>
                        
                        {/* Dialogue Box */}
                        {scenario.dialogue && scenario.dialogue.length > 0 && scenario.dialogue[0].text && (
                          <div className="bg-black/30 p-3 rounded border-l-2 border-pink-500 mb-2">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1">
                                <span className="text-pink-400 text-xs font-bold uppercase mb-1 block">{scenario.dialogue[0].speaker}</span>
                                <p className="text-sm italic font-body">"{scenario.dialogue[0].text}"</p>
                              </div>
                              <button 
                                onClick={() => handlePlayAudio(scenario.dialogue![0].text, 'Nữ')}
                                disabled={playingAudio}
                                className={`p-2 rounded-full flex-shrink-0 ${playingAudio ? 'bg-gray-700' : 'bg-military-600 text-white'}`}
                              >
                                <PlayIcon />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      {scenario.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => !feedback && handleChoice(opt)}
                          className={`w-full text-left p-4 rounded border transition-all font-body
                            ${feedback 
                              ? (opt.isCorrect ? 'bg-green-900/40 border-green-500' : (feedback.text === opt.feedback ? 'bg-red-900/40 border-red-500' : 'opacity-50'))
                              : 'bg-military-800 border-military-600 hover:border-shopee-orange hover:bg-military-700'
                            }
                          `}
                        >
                          <span className="font-bold font-mono mr-2">{opt.id}.</span> {opt.text}
                        </button>
                      ))}
                    </div>

                    {/* Feedback Modal/Overlay Area */}
                    {feedback && (
                      <div className={`p-4 rounded border-l-4 mt-4 ${feedback.correct ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'} animate-fade-in`}>
                        <h4 className={`font-heading mb-1 ${feedback.correct ? 'text-green-500' : 'text-red-500'}`}>
                          {feedback.correct ? 'CHÍNH XÁC!' : 'RÚT KINH NGHIỆM!'}
                        </h4>
                        <p className="text-sm mb-4 font-body">{feedback.text}</p>
                        <Button onClick={handleNextScenario} variant={feedback.correct ? 'primary' : 'outline'} className="w-full py-2 text-sm">
                          {feedback.correct ? (scenariosCompleted === 4 ? 'HOÀN THÀNH NHIỆM VỤ' : 'TÌNH HUỐNG TIẾP THEO') : 'THỬ LẠI'}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-red-500">Lỗi tải dữ liệu. Vui lòng kiểm tra kết nối.</div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const view = useStore(state => state.view);

  const renderView = () => {
    switch (view) {
      case ViewState.LOGIN: return <LoginScreen />;
      case ViewState.DASHBOARD: return <DashboardScreen />;
      case ViewState.PLACEMENT_TEST: return <PlacementTestScreen />;
      case ViewState.CURRICULUM: return <CurriculumScreen />;
      case ViewState.LESSON_DETAIL: return <LessonDetailScreen />;
      default: return <LoginScreen />;
    }
  };

  return (
    <div className="font-body text-gray-100 max-w-md mx-auto shadow-2xl min-h-screen bg-military-900">
      {renderView()}
    </div>
  );
};

export default App;