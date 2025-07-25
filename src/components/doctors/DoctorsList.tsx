import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Clock, GraduationCap } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualifications: string;
  rating: number;
  experience: string;
  location: string;
  availability: string;
  profilePicture?: string;
}

const DoctorsList = () => {
  // Mock doctors data - replace with actual API call
  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      qualifications: 'MD, PhD in Cardiology',
      rating: 4.9,
      experience: '15 years',
      location: 'New York, NY',
      availability: 'Available Today',
      profilePicture: '/api/placeholder/100/100'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Neurology',
      qualifications: 'MD, Neurology Specialist',
      rating: 4.8,
      experience: '12 years',
      location: 'Los Angeles, CA',
      availability: 'Next Available: Tomorrow',
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialization: 'Dermatology',
      qualifications: 'MD, Dermatology Board Certified',
      rating: 4.7,
      experience: '10 years',
      location: 'Chicago, IL',
      availability: 'Available Today',
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialization: 'Orthopedics',
      qualifications: 'MD, Orthopedic Surgery',
      rating: 4.9,
      experience: '18 years',
      location: 'Houston, TX',
      availability: 'Next Available: Monday',
    }
  ];

  const getSpecializationColor = (specialization: string) => {
    const colors: Record<string, string> = {
      'Cardiology': 'bg-red-100 text-red-800',
      'Neurology': 'bg-purple-100 text-purple-800',
      'Dermatology': 'bg-green-100 text-green-800',
      'Orthopedics': 'bg-blue-100 text-blue-800',
    };
    return colors[specialization] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Find Doctors</h2>
        <p className="text-muted-foreground">Browse our network of qualified healthcare professionals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={doctor.profilePicture} alt={doctor.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge className={getSpecializationColor(doctor.specialization)}>
                      {doctor.specialization}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span>{doctor.qualifications}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{doctor.experience} experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm font-medium text-success">{doctor.availability}</p>
                </div>
                <Button size="sm">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {doctors.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
            <p className="text-muted-foreground">
              We're working to add more healthcare professionals to our network.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorsList;