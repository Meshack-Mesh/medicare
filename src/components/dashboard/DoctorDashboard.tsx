import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuestions } from '@/contexts/QuestionsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, MessageSquare, User, Clock, Send } from 'lucide-react';
import ProfileForm from '@/components/profile/ProfileForm';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { getPendingQuestions, answerQuestion } = useQuestions();
  const [activeTab, setActiveTab] = useState('questions');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const pendingQuestions = getPendingQuestions();

  const handleAnswer = (questionId: string) => {
    const answer = answers[questionId];
    if (answer && user) {
      answerQuestion(questionId, answer, user.id, user.name);
      setAnswers({ ...answers, [questionId]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dr. {user?.name}</h1>
              <p className="opacity-90">Help patients with their health concerns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Patient Questions
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Patient Questions</h2>
                <p className="text-muted-foreground">Review and respond to patient inquiries</p>
              </div>
              <Badge variant="secondary">
                {pendingQuestions.length} Pending
              </Badge>
            </div>

            <div className="space-y-4">
              {pendingQuestions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{question.title}</h3>
                          <Badge>{question.category}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          <strong>Patient:</strong> {question.patientName}
                        </p>
                        <p className="mb-4">{question.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Asked: {new Date(question.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <Textarea
                          placeholder="Write your medical advice here..."
                          value={answers[question.id] || ''}
                          onChange={(e) => setAnswers({...answers, [question.id]: e.target.value})}
                          rows={4}
                          className="mb-2"
                        />
                        <Button 
                          onClick={() => handleAnswer(question.id)}
                          disabled={!answers[question.id]?.trim()}
                          size="sm"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Answer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {pendingQuestions.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No pending questions</h3>
                    <p className="text-muted-foreground">All patient questions have been answered.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;