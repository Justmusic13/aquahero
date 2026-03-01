export interface BubblePosition {
  x: number;
  y: number;
  id: number;
  size: number;
  speed: number;
}

export const generateBubble = (id: number, containerWidth: number, containerHeight: number): BubblePosition => {
  return {
    x: Math.random() * (containerWidth - 50),
    y: containerHeight,
    id,
    size: Math.random() * 30 + 20,
    speed: Math.random() * 2 + 1,
  };
};

export const updateBubblePosition = (bubble: BubblePosition): BubblePosition => {
  return {
    ...bubble,
    y: bubble.y - bubble.speed,
  };
};

export const checkBubbleClick = (
  bubble: BubblePosition,
  clickX: number,
  clickY: number
): boolean => {
  const distance = Math.sqrt(
    Math.pow(clickX - (bubble.x + bubble.size / 2), 2) +
    Math.pow(clickY - (bubble.y + bubble.size / 2), 2)
  );
  return distance <= bubble.size / 2;
};

export const calculateGameScore = (bubblesPopped: number, timeElapsed: number): number => {
  const baseScore = bubblesPopped * 10;
  const timeBonus = Math.max(0, 60 - timeElapsed) * 2;
  return baseScore + timeBonus;
};

export const getRandomQuizQuestion = () => {
  const questions = [
    {
      question: "How long should you wash your hands?",
      options: ["5 seconds", "20 seconds", "1 minute", "5 minutes"],
      correct: 1,
    },
    {
      question: "What should you use to wash your hair?",
      options: ["Soap", "Shampoo", "Water only", "Toothpaste"],
      correct: 1,
    },
    {
      question: "How often should you shower?",
      options: ["Once a week", "Every day", "Once a month", "Never"],
      correct: 1,
    },
    {
      question: "What helps remove germs from your body?",
      options: ["Hot water", "Soap", "Cold water", "Towels"],
      correct: 1,
    },
    {
      question: "When should you wash your hands?",
      options: ["Before eating", "After using bathroom", "After playing", "All of the above"],
      correct: 3,
    },
  ];
  
  return questions[Math.floor(Math.random() * questions.length)];
};
