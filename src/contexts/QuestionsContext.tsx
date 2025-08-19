import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Question {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  description: string;
  category?: string;
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
  fetchQuestions: () => void;
  isLoading: boolean;
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = useAuth();

  const fetchQuestions = async () => {
    if (!session?.user) return;
    
    setIsLoading(true);
    try {
      const { data: questionsData, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching questions:', error);
        return;
      }

      const formattedQuestions: Question[] = questionsData?.map(q => ({
        id: q.id,
        patientId: q.patient_id,
        patientName: 'Unknown Patient', // We'll fetch names separately
        title: q.title,
        description: q.content,
        status: q.response ? 'answered' : 'pending',
        createdAt: q.created_at,
        answer: q.response || undefined,
        doctorId: q.doctor_id || undefined,
        doctorName: undefined, // We'll fetch names separately
        answeredAt: q.updated_at !== q.created_at ? q.updated_at : undefined,
      })) || [];

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = async (questionData: Omit<Question, 'id' | 'createdAt' | 'status'>) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('questions')
        .insert({
          patient_id: session.user.id,
          title: questionData.title,
          content: questionData.description,
          status: 'pending'
        });

      if (error) {
        console.error('Error adding question:', error);
        return;
      }

      fetchQuestions();
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const answerQuestion = async (questionId: string, answer: string, doctorId: string, doctorName: string) => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('questions')
        .update({
          response: answer,
          doctor_id: session.user.id,
          status: 'answered'
        })
        .eq('id', questionId);

      if (error) {
        console.error('Error answering question:', error);
        return;
      }

      fetchQuestions();
    } catch (error) {
      console.error('Error answering question:', error);
    }
  };

  const getPatientQuestions = (patientId: string) => {
    return questions.filter(question => question.patientId === patientId);
  };

  const getPendingQuestions = () => {
    return questions.filter(question => question.status === 'pending');
  };

  useEffect(() => {
    if (session?.user) {
      fetchQuestions();
    }
  }, [session?.user]);

  const value = {
    questions,
    addQuestion,
    answerQuestion,
    getPatientQuestions,
    getPendingQuestions,
    fetchQuestions,
    isLoading
  };

  return <QuestionsContext.Provider value={value}>{children}</QuestionsContext.Provider>;
};