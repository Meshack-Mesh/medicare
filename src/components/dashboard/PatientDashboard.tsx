import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuestions } from '@/contexts/QuestionsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageSquare, User, Calendar, Plus, Clock, CheckCircle } from 'lucide-react';
import DoctorsList from '@/components/doctors/DoctorsList';
import AskQuestionForm from '@/components/questions/AskQuestionForm';
import ProfileForm from '@/components/profile/ProfileForm';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { getPatientQuestions } = useQuestions();
  const [activeTab, setActiveTab] = useState('overview');
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const patientQuestions = user ? getPatientQuestions(user.id) : [];
  const answeredQuestions = patientQuestions.filter(q => q.status === 'answered');
  const pendingQuestions = patientQuestions.filter(q => q.status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
              <p className="opacity-90">Manage your health and connect with doctors</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="doctors" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Find Doctors
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              My Questions
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                      <p className="text-2xl font-bold">{patientQuestions.length}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Answered</p>
                      <p className="text-2xl font-bold text-success">{answeredQuestions.length}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-warning">{pendingQuestions.length}</p>
                    </div>
                    <Clock className="w-8 h-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Questions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Questions</CardTitle>
                    <CardDescription>Your latest health inquiries</CardDescription>
                  </div>
                  <Button onClick={() => setActiveTab('questions')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {patientQuestions.slice(0, 3).length > 0 ? (
                  <div className="space-y-4">
                    {patientQuestions.slice(0, 3).map((question) => (
                      <div key={question.id} className="border-l-4 border-primary pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{question.title}</h4>
                          <Badge variant={question.status === 'answered' ? 'default' : 'secondary'}>
                            {question.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {question.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">You haven't asked any questions yet.</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setActiveTab('questions')}
                    >
                      Ask Your First Question
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors">
            <DoctorsList />
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">My Questions</h2>
                <p className="text-muted-foreground">Ask questions and get expert medical advice</p>
              </div>
              <Button 
                onClick={() => setShowQuestionForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ask Question
              </Button>
            </div>

            {showQuestionForm && (
              <AskQuestionForm onClose={() => setShowQuestionForm(false)} />
            )}

            <div className="space-y-4">
              {patientQuestions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{question.title}</h3>
                          <Badge variant={question.status === 'answered' ? 'default' : 'secondary'}>
                            {question.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{question.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Category: {question.category}</span>
                          <span>Asked: {new Date(question.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {question.status === 'answered' && question.answer && (
                      <div className="mt-4 p-4 bg-primary-light rounded-lg border-l-4 border-primary">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="font-medium text-sm">Answer by {question.doctorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {question.answeredAt && new Date(question.answeredAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{question.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {patientQuestions.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by asking your first health-related question
                    </p>
                    <Button onClick={() => setShowQuestionForm(true)}>
                      Ask Your First Question
                    </Button>
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

export default PatientDashboard;