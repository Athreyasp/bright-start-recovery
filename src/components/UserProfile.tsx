import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Calendar, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    dateOfBirth: profile?.date_of_birth || '',
    emergencyContactName: profile?.emergency_contact_name || '',
    emergencyContactPhone: profile?.emergency_contact_phone || '',
    recoveryStartDate: profile?.recovery_start_date || ''
  });

  const handleSave = async () => {
    await updateProfile({
      full_name: formData.fullName,
      phone: formData.phone,
      date_of_birth: formData.dateOfBirth,
      emergency_contact_name: formData.emergencyContactName,
      emergency_contact_phone: formData.emergencyContactPhone,
      recovery_start_date: formData.recoveryStartDate
    });
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-background font-poppins p-4">
      <div className="container mx-auto max-w-2xl">
        <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <User className="w-6 h-6 mr-2 text-primary" />
              Profile Settings
            </CardTitle>
            <Button 
              variant={editing ? "default" : "outline"}
              onClick={() => editing ? handleSave() : setEditing(true)}
            >
              {editing ? "Save Changes" : "Edit Profile"}
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  disabled={!editing}
                />
              </div>
               <div className="space-y-2">
                 <Label>Email</Label>
                 <Input value={user?.email || ''} disabled />
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  disabled={!editing}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                    disabled={!editing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
                    disabled={!editing}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Recovery Start Date</Label>
              <Input
                type="date"
                value={formData.recoveryStartDate}
                onChange={(e) => setFormData({...formData, recoveryStartDate: e.target.value})}
                disabled={!editing}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;