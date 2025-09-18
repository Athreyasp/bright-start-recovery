import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, Loader2, Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client'
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const AppointmentBooking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const [formData, setFormData] = useState({
    providerType: searchParams.get('type') || '',
    providerName: '',
    appointmentDate: '',
    appointmentTime: '',
    durationMinutes: 60,
    notes: ''
  });

  const doctorsInBengaluru = [
    { name: "Dr. Rajesh Kumar", specialty: "Addiction Medicine", location: "Koramangala, Bengaluru", experience: "15 years" },
    { name: "Dr. Priya Sharma", specialty: "Psychiatry", location: "Indiranagar, Bengaluru", experience: "12 years" },
    { name: "Dr. Anil Menon", specialty: "General Medicine", location: "JP Nagar, Bengaluru", experience: "18 years" },
    { name: "Dr. Sunita Reddy", specialty: "Psychology", location: "Whitefield, Bengaluru", experience: "10 years" },
    { name: "Dr. Vikram Singh", specialty: "Addiction Counseling", location: "Electronic City, Bengaluru", experience: "8 years" },
    { name: "Dr. Kavitha Nair", specialty: "Psychiatry", location: "Marathahalli, Bengaluru", experience: "14 years" },
    { name: "Dr. Ravi Krishnan", specialty: "General Medicine", location: "HSR Layout, Bengaluru", experience: "16 years" },
    { name: "Dr. Meera Iyer", specialty: "Psychology", location: "Banashankari, Bengaluru", experience: "11 years" }
  ];

  const providerTypes = [
    { value: 'doctor', label: 'General Doctor', description: 'Primary care physician for overall health' },
    { value: 'psychologist', label: 'Psychologist', description: 'Therapy and counseling services' },
    { value: 'psychiatrist', label: 'Psychiatrist', description: 'Medication management and specialized care' },
    { value: 'therapist', label: 'Addiction Counselor', description: 'Specialized addiction therapy' },
    { value: 'social-worker', label: 'Social Worker', description: 'Case management and support services' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (!formData.providerType || !formData.appointmentDate || !formData.appointmentTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    
    try {
      const { error } = await supabase.from('appointments').insert({
        user_id: user.id,
        provider_type: formData.providerType,
        provider_name: formData.providerName || null,
        appointment_date: formData.appointmentDate,
        appointment_time: formData.appointmentTime,
        duration_minutes: formData.durationMinutes,
        notes: formData.notes || null,
        status: 'scheduled'
      });

      if (error) throw error;

      toast({
        title: "Appointment Scheduled!",
        description: "Your appointment has been scheduled successfully.",
      });

      // Reset form and refresh appointments
      setFormData({
        providerType: '',
        providerName: '',
        appointmentDate: '',
        appointmentTime: '',
        durationMinutes: 60,
        notes: ''
      });
      setShowBookingForm(false);
      await fetchAppointments();
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment Updated",
        description: `Appointment status changed to ${newStatus}.`,
      });

      await fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-primary/10 text-primary';
      case 'completed': return 'bg-success/10 text-success';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      case 'no-show': return 'bg-warning/10 text-warning';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-poppins p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-poppins p-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground">Schedule and manage your healthcare appointments</p>
          </div>
          <Button onClick={() => setShowBookingForm(!showBookingForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>

        {/* Booking Form */}
        {showBookingForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Schedule New Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Provider Type *</Label>
                <Select value={formData.providerType} onValueChange={(value) => setFormData({...formData, providerType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider type" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Doctor in Bengaluru</Label>
                <Select value={formData.providerName} onValueChange={(value) => setFormData({...formData, providerName: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose from available doctors" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctorsInBengaluru
                      .filter(doctor => {
                        if (formData.providerType === 'doctor') return doctor.specialty.includes('Medicine');
                        if (formData.providerType === 'psychologist') return doctor.specialty === 'Psychology';
                        if (formData.providerType === 'psychiatrist') return doctor.specialty === 'Psychiatry';
                        if (formData.providerType === 'therapist') return doctor.specialty.includes('Counseling');
                        return true;
                      })
                      .map((doctor) => (
                        <SelectItem key={doctor.name} value={doctor.name}>
                          <div className="flex flex-col">
                            <div className="font-medium">{doctor.name}</div>
                            <div className="text-sm text-muted-foreground">{doctor.specialty} • {doctor.location}</div>
                            <div className="text-xs text-muted-foreground">{doctor.experience} experience</div>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Appointment Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.appointmentDate ? format(new Date(formData.appointmentDate), "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.appointmentDate ? new Date(formData.appointmentDate) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            setFormData({...formData, appointmentDate: format(date, 'yyyy-MM-dd')});
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Time *</Label>
                  <Select value={formData.appointmentTime} onValueChange={(value) => setFormData({...formData, appointmentTime: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Select value={formData.durationMinutes.toString()} onValueChange={(value) => setFormData({...formData, durationMinutes: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Reason for visit, specific concerns, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Schedule Appointment
                </Button>
                <Button variant="outline" onClick={() => setShowBookingForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Appointments</h2>
          
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Appointments Scheduled</h3>
                <p className="text-muted-foreground mb-4">Book your first appointment to get started with professional support.</p>
                <Button onClick={() => setShowBookingForm(true)}>
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-primary" />
                          <span className="font-semibold capitalize">
                            {appointment.provider_name || appointment.provider_type.replace('-', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-sm ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{format(new Date(appointment.appointment_date), 'PPP')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{format(new Date(appointment.appointment_date), 'p')}</span>
                          </div>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                        )}
                      </div>
                      
                      {appointment.status === 'scheduled' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          >
                            Mark Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;