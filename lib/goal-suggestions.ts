interface GoalSuggestion {
  category: 'Learning' | 'Health' | 'Career' | 'Behaviour' | 'Emotional' | 'Financial'
  icon: string
  note: string
}

type KeywordMap = {
  [key: string]: GoalSuggestion
}

const KEYWORD_MAP: KeywordMap = {
  // Learning keywords
  python: {
    category: 'Learning',
    icon: '🐍',
    note: 'Build consistency in Python practice to improve automation and problem-solving skills.',
  },
  code: {
    category: 'Learning',
    icon: '💻',
    note: 'Daily coding practice builds strong foundations for software development.',
  },
  programming: {
    category: 'Learning',
    icon: '💻',
    note: 'Consistent programming practice improves problem-solving and technical skills.',
  },
  javascript: {
    category: 'Learning',
    icon: '📜',
    note: 'Regular JavaScript practice strengthens web development fundamentals.',
  },
  react: {
    category: 'Learning',
    icon: '⚛️',
    note: 'Building React projects daily improves component design and state management.',
  },
  learn: {
    category: 'Learning',
    icon: '📚',
    note: 'Daily learning compounds knowledge and opens new opportunities over time.',
  },
  study: {
    category: 'Learning',
    icon: '📖',
    note: 'Consistent study habits build deep understanding and long-term retention.',
  },
  reading: {
    category: 'Learning',
    icon: '📚',
    note: 'Reading daily expands perspective and knowledge across diverse topics.',
  },
  read: {
    category: 'Learning',
    icon: '📖',
    note: 'Daily reading builds vocabulary, empathy, and critical thinking skills.',
  },
  book: {
    category: 'Learning',
    icon: '📚',
    note: 'Reading books regularly compounds knowledge and improves focus.',
  },
  course: {
    category: 'Learning',
    icon: '🎓',
    note: 'Completing courses consistently builds structured knowledge and skills.',
  },
  tutorial: {
    category: 'Learning',
    icon: '📝',
    note: 'Following tutorials daily helps build practical, hands-on experience.',
  },
  language: {
    category: 'Learning',
    icon: '🗣️',
    note: 'Daily language practice builds fluency and cultural understanding.',
  },
  skill: {
    category: 'Learning',
    icon: '🎯',
    note: 'Practicing skills daily creates expertise through consistent repetition.',
  },

  // Health keywords
  gym: {
    category: 'Health',
    icon: '💪',
    note: 'Regular gym sessions improve strength, energy, and long-term health.',
  },
  exercise: {
    category: 'Health',
    icon: '🏃',
    note: 'Daily exercise boosts energy, mood, and overall physical well-being.',
  },
  workout: {
    category: 'Health',
    icon: '💪',
    note: 'Consistent workouts build strength, endurance, and mental resilience.',
  },
  run: {
    category: 'Health',
    icon: '🏃',
    note: 'Running regularly improves cardiovascular health and mental clarity.',
  },
  running: {
    category: 'Health',
    icon: '🏃',
    note: 'Daily running builds endurance, mental strength, and physical fitness.',
  },
  yoga: {
    category: 'Health',
    icon: '🧘',
    note: 'Yoga practice improves flexibility, balance, and mental calm.',
  },
  meditation: {
    category: 'Emotional',
    icon: '🧘',
    note: 'Daily meditation reduces stress and improves focus and emotional regulation.',
  },
  fitness: {
    category: 'Health',
    icon: '💪',
    note: 'Consistent fitness routines improve energy, confidence, and longevity.',
  },
  walk: {
    category: 'Health',
    icon: '🚶',
    note: 'Daily walks improve cardiovascular health and mental well-being.',
  },
  jog: {
    category: 'Health',
    icon: '🏃',
    note: 'Regular jogging builds endurance and improves overall fitness.',
  },
  cardio: {
    category: 'Health',
    icon: '❤️',
    note: 'Cardio exercise strengthens heart health and boosts energy levels.',
  },
  weight: {
    category: 'Health',
    icon: '💪',
    note: 'Weight training builds muscle strength and improves bone density.',
  },
  diet: {
    category: 'Health',
    icon: '🥗',
    note: 'Mindful eating habits support long-term health and energy levels.',
  },
  nutrition: {
    category: 'Health',
    icon: '🥗',
    note: 'Focusing on nutrition daily improves energy, mood, and overall health.',
  },

  // Career keywords
  job: {
    category: 'Career',
    icon: '💼',
    note: 'Building career skills daily opens new opportunities and growth.',
  },
  career: {
    category: 'Career',
    icon: '📈',
    note: 'Investing in career development compounds into long-term professional success.',
  },
  interview: {
    category: 'Career',
    icon: '🎤',
    note: 'Practicing interviews regularly builds confidence and communication skills.',
  },
  resume: {
    category: 'Career',
    icon: '📄',
    note: 'Keeping your resume updated ensures you\'re ready for opportunities.',
  },
  promotion: {
    category: 'Career',
    icon: '📈',
    note: 'Building skills consistently positions you for career advancement.',
  },
  networking: {
    category: 'Career',
    icon: '🤝',
    note: 'Regular networking builds relationships that open doors over time.',
  },
  professional: {
    category: 'Career',
    icon: '💼',
    note: 'Daily professional development compounds into career growth.',
  },
  work: {
    category: 'Career',
    icon: '💼',
    note: 'Improving work skills daily enhances performance and opportunities.',
  },

  // Financial keywords
  budget: {
    category: 'Financial',
    icon: '💰',
    note: 'Tracking expenses daily builds awareness and financial control.',
  },
  save: {
    category: 'Financial',
    icon: '💵',
    note: 'Saving consistently, even small amounts, compounds into financial security.',
  },
  money: {
    category: 'Financial',
    icon: '💰',
    note: 'Building money habits daily creates long-term financial stability.',
  },
  finance: {
    category: 'Financial',
    icon: '📊',
    note: 'Learning about finance daily improves financial decision-making.',
  },
  invest: {
    category: 'Financial',
    icon: '📈',
    note: 'Learning to invest builds wealth through compound growth over time.',
  },
  savings: {
    category: 'Financial',
    icon: '💵',
    note: 'Building savings consistently creates financial security and peace of mind.',
  },
  debt: {
    category: 'Financial',
    icon: '📉',
    note: 'Paying down debt consistently frees up future income and reduces stress.',
  },
  expense: {
    category: 'Financial',
    icon: '💸',
    note: 'Tracking expenses daily builds awareness and better spending habits.',
  },
  income: {
    category: 'Financial',
    icon: '💼',
    note: 'Building income streams creates financial independence over time.',
  },

  // Emotional keywords
  mindfulness: {
    category: 'Emotional',
    icon: '🧘',
    note: 'Daily mindfulness practice improves emotional regulation and reduces stress.',
  },
  journal: {
    category: 'Emotional',
    icon: '📔',
    note: 'Journaling regularly improves self-awareness and emotional processing.',
  },
  gratitude: {
    category: 'Emotional',
    icon: '🙏',
    note: 'Practicing gratitude daily shifts perspective and improves well-being.',
  },
  therapy: {
    category: 'Emotional',
    icon: '💚',
    note: 'Consistent therapy supports emotional growth and mental health.',
  },
  'self-care': {
    category: 'Emotional',
    icon: '💆',
    note: 'Prioritizing self-care daily maintains energy and prevents burnout.',
  },
  mental: {
    category: 'Emotional',
    icon: '🧠',
    note: 'Caring for mental health daily improves overall quality of life.',
  },
  stress: {
    category: 'Emotional',
    icon: '😌',
    note: 'Managing stress daily improves resilience and overall well-being.',
  },

  // Behaviour keywords
  habit: {
    category: 'Behaviour',
    icon: '🔄',
    note: 'Building habits through small daily actions creates lasting change.',
  },
  routine: {
    category: 'Behaviour',
    icon: '⏰',
    note: 'Consistent routines reduce decision fatigue and increase productivity.',
  },
  consistency: {
    category: 'Behaviour',
    icon: '📊',
    note: 'Showing up daily, even in small ways, compounds into significant progress.',
  },
  discipline: {
    category: 'Behaviour',
    icon: '⚡',
    note: 'Daily discipline builds self-trust and long-term achievement.',
  },
  morning: {
    category: 'Behaviour',
    icon: '🌅',
    note: 'Morning routines set a positive tone for the entire day.',
  },
  evening: {
    category: 'Behaviour',
    icon: '🌙',
    note: 'Evening routines improve sleep quality and next-day preparation.',
  },
}

export function getGoalSuggestions(title: string): GoalSuggestion | null {
  if (!title || title.trim().length < 3) {
    return null
  }

  const normalized = title.toLowerCase().trim()

  // Check for exact keyword matches first (higher priority)
  for (const keyword in KEYWORD_MAP) {
    if (normalized === keyword || normalized.includes(keyword)) {
      return KEYWORD_MAP[keyword]
    }
  }

  return null
}

