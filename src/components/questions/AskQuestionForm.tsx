import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useQuestions } from '@/contexts/QuestionsContext';
import { useToast } from '@/hooks/use-toast';
import { X, Send } from 'lucide-react';

interface AskQuestionFormProps {
  onClose: () => void;
}

const AskQuestionForm: React.FC<AskQuestionFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { addQuestion } = useQuestions();
  const { toast } = useToast();

  const categories = [
    'General Health',
    'Cardiology',
    'Neurology',
    'Dermatology',
    'Orthopedics',
    'Psychiatry',
    'Pediatrics',
    'Gynecology',
    'Urology',
    'Ophthalmology',
    'ENT',
    'Emergency Medicine'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to ask a question",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      addQuestion({
        patientId: user.id,
        patientName: user.name,
        title: formData.title,
        description: formData.description,
        category: formData.category
      });

      toast({
        title: "Success",
        description: "Your question has been submitted successfully!",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Ask a Health Question</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Question Title</Label>
            <Input
              id="title"
              placeholder="Brief summary of your question"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({...formData, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a medical category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              placeholder="Please describe your symptoms, concerns, or questions in detail. Include relevant medical history if applicable."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={6}
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Send className="w-4 h-4 mr-2 animate-pulse" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Question
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Disclaimer:</strong> This platform is for informational purposes only and does not replace professional medical advice. 
            In case of emergency, please contact your local emergency services immediately.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AskQuestionForm;