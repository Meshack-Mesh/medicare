import React, { createContext, useContext, useState } from 'react';

export interface Question {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'answered';
  createdAt: string;
  answer?: string;
  doctorId?: string;
  doctorName?: string;
  answeredAt?: string;
}

interface QuestionsContextType {
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'status'>) => void;
  answerQuestion: (questionId: string, answer: string, doctorId: string, doctorName: string) => void;
  getPatientQuestions: (patientId: string) => Question[];
  getPendingQuestions: () => Question[];
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (context === undefined) {
    throw new Error('useQuestions must be used within a QuestionsProvider');
  }
  return context;
};

export const QuestionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      patientId: '1',
      patientName: 'John Doe',
      title: 'Chest Pain Concerns',
      description: 'I have been experiencing chest pain for the past few days. It usually happens when I exercise or climb stairs. Should I be concerned?',
      category: 'Cardiology',
      status: 'answered',
      createdAt: '2024-01-15T10:30:00Z',
      answer: 'Based on your symptoms, I recommend scheduling an immediate consultation. Chest pain during exercise could indicate various cardiac conditions that need proper evaluation. Please avoid strenuous activities until we can examine you properly.',
      doctorId: 'doc1',
      doctorName: 'Dr. Sarah Johnson',
      answeredAt: '2024-01-15T14:20:00Z'
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'Jane Smith',
      title: 'Persistent Headaches',
      description: 'I have been having daily headaches for over a week. They are usually worse in the morning and improve throughout the day.',
      category: 'Neurology',
      status: 'pending',
      createdAt: '2024-01-16T09:15:00Z'
    }
  ]);

  const addQuestion = (questionData: Omit<Question, 'id' | 'createdAt' | 'status'>) => {
    const newQuestion: Question = {
      ...questionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setQuestions(prev => [newQuestion, ...prev]);
  };

  const answerQuestion = (questionId: string, answer: string, doctorId: string, doctorName: string) => {
    setQuestions(prev => prev.map(question => 
      question.id === questionId 
        ? {
            ...question,
            answer,
            doctorId,
            doctorName,
            answeredAt: new Date().toISOString(),
            status: 'answered' as const
          }
        : question
    ));
  };

  const getPatientQuestions = (patientId: string) => {
    return questions.filter(question => question.patientId === patientId);
  };

  const getPendingQuestions = () => {
    return questions.filter(question => question.status === 'pending');
  };

  const value = {
    questions,
    addQuestion,
    answerQuestion,
    getPatientQuestions,
    getPendingQuestions
  };

  return <QuestionsContext.Provider value={value}>{children}</QuestionsContext.Provider>;
};