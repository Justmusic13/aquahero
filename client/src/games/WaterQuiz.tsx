import React, { useState, useEffect, useRef } from 'react';

interface WaterQuizProps {
  onGameEnd: (score: number, durationSeconds: number) => void;
  remainingSeconds: number;
}

interface Question {
  question: string;
  options: string[];
  correct: number;
  funFact: string;
}

const ALL_QUESTIONS: Question[] = [
  {
    question: 'How much of Earth is covered by water?',
    options: ['About 50%', 'About 70%', 'About 90%', 'About 30%'],
    correct: 1,
    funFact: 'About 71% of Earth\'s surface is water!',
  },
  {
    question: 'How long should you wash your hands?',
    options: ['5 seconds', '20 seconds', '2 minutes', '10 seconds'],
    correct: 1,
    funFact: 'Singing "Happy Birthday" twice takes about 20 seconds!',
  },
  {
    question: 'Which uses LESS water?',
    options: ['A bath', 'A 5-minute shower', 'They\'re the same', 'Depends on the day'],
    correct: 1,
    funFact: 'A 5-minute shower uses about 15 gallons, a bath uses 30-50!',
  },
  {
    question: 'What animal can survive without water the longest?',
    options: ['Elephant', 'Camel', 'Kangaroo rat', 'Dolphin'],
    correct: 2,
    funFact: 'Kangaroo rats can go their whole life without drinking water!',
  },
  {
    question: 'What should you do while brushing your teeth?',
    options: ['Leave water running', 'Turn off the faucet', 'Take a bath', 'Water the plants'],
    correct: 1,
    funFact: 'Turning off the tap saves up to 8 gallons per day!',
  },
  {
    question: 'What is the biggest ocean on Earth?',
    options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'],
    correct: 2,
    funFact: 'The Pacific Ocean is bigger than all the land on Earth combined!',
  },
  {
    question: 'How many glasses of water should kids drink per day?',
    options: ['1-2 glasses', '3-4 glasses', '6-8 glasses', '15 glasses'],
    correct: 2,
    funFact: 'Drinking water helps your brain work better!',
  },
  {
    question: 'What color is pure water?',
    options: ['Blue', 'Clear/No color', 'White', 'Green'],
    correct: 1,
    funFact: 'Water in the ocean looks blue because it reflects the sky!',
  },
  {
    question: 'Where does most drinking water come from?',
    options: ['The ocean', 'Rivers and lakes', 'Underground', 'Rain clouds'],
    correct: 2,
    funFact: 'Most fresh water is underground in aquifers!',
  },
  {
    question: 'A leaky faucet can waste how much water per day?',
    options: ['1 cup', '1 gallon', '5 gallons', '100 gallons'],
    correct: 2,
    funFact: 'That\'s enough to fill a fish tank every day!',
  },
];

const shuffleArray = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const WaterQuiz: React.FC<WaterQuizProps> = ({ onGameEnd, remainingSeconds }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const startTime = useRef(0);

  const TOTAL_QUESTIONS = 8;

  const startGame = () => {
    setQuestions(shuffleArray(ALL_QUESTIONS).slice(0, TOTAL_QUESTIONS));
    setCurrentQ(0);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setShowResult(false);
    setIsPlaying(true);
    setGameOver(false);
    startTime.current = Date.now();
  };

  const handleAnswer = (optionIndex: number) => {
    if (showResult) return;
    setSelected(optionIndex);
    setShowResult(true);

    const isCorrect = optionIndex === questions[currentQ].correct;
    if (isCorrect) {
      const streakBonus = streak * 25;
      setScore(prev => prev + 100 + streakBonus);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setIsPlaying(false);
      setGameOver(true);
      return;
    }
    setCurrentQ(prev => prev + 1);
    setSelected(null);
    setShowResult(false);
  };

  useEffect(() => {
    if (gameOver) {
      const duration = Math.floor((Date.now() - startTime.current) / 1000);
      onGameEnd(score, duration);
    }
  }, [gameOver]);

  if (!isPlaying && !gameOver) {
    return (
      <div className="text-center p-8">
        <span className="text-6xl block mb-4">🧠💧</span>
        <h3 className="text-2xl font-bold mb-2">Water Quiz!</h3>
        <p className="mb-4">Test your water knowledge! Get streak bonuses for correct answers in a row!</p>
        <button
          onClick={startGame}
          className="px-8 py-3 bg-teal-500 text-white rounded-full font-bold text-lg hover:scale-105 transition-transform"
        >
          Play!
        </button>
      </div>
    );
  }

  if (gameOver) {
    const percentage = Math.round((score / (TOTAL_QUESTIONS * 100)) * 100);
    return (
      <div className="text-center p-8">
        <span className="text-6xl block mb-4">{percentage >= 70 ? '🏆' : '📚'}</span>
        <h3 className="text-2xl font-bold mb-2">
          {percentage >= 70 ? 'Amazing!' : 'Good Try!'}
        </h3>
        <p className="text-3xl font-bold mb-4">Score: {score}</p>
        <button
          onClick={startGame}
          className="px-8 py-3 bg-teal-500 text-white rounded-full font-bold text-lg hover:scale-105 transition-transform"
        >
          Play Again!
        </button>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between mb-4">
        <span className="font-bold">Q {currentQ + 1}/{questions.length}</span>
        <span className="font-bold">⭐ {score}</span>
        {streak > 1 && (
          <span className="font-bold text-orange-500">🔥 {streak}x Streak!</span>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
        <h3 className="text-xl font-bold text-center mb-6">{q.question}</h3>

        <div className="flex flex-col gap-3">
          {q.options.map((option, index) => {
            let btnClass = 'p-4 rounded-xl text-left font-medium transition-all border-2 ';
            if (showResult) {
              if (index === q.correct) {
                btnClass += 'bg-green-100 border-green-500 text-green-800';
              } else if (index === selected && index !== q.correct) {
                btnClass += 'bg-red-100 border-red-500 text-red-800';
              } else {
                btnClass += 'bg-gray-50 border-gray-200 text-gray-400';
              }
            } else {
              btnClass += 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-400 cursor-pointer';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={btnClass}
                disabled={showResult}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className="bg-yellow-50 rounded-xl p-4 mb-4 text-center">
          <p className="text-2xl mb-2">{selected === q.correct ? '✅ Correct!' : '❌ Not quite!'}</p>
          <p className="text-sm text-gray-600">💡 {q.funFact}</p>
          <button
            onClick={nextQuestion}
            className="mt-3 px-6 py-2 bg-blue-500 text-white rounded-full font-bold hover:scale-105 transition-transform"
          >
            {currentQ + 1 >= questions.length ? 'See Results' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default WaterQuiz;
