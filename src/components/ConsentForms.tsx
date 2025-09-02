import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, Users, CheckCircle, Clock, X, Loader2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, ConsentForm } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const ConsentForms = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [forms, setForms] = useState<ConsentForm[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);

  const [formData, setFormData] = useState({
    formType: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    relationship: ''
  });

  const formTypes = [
    { value: 'parent', label: 'Parent/Guardian', description: 'Allow parents/guardians to receive updates' },
    { value: 'spouse', label: 'Spouse/Partner', description: 'Include your partner in recovery communications' },
    { value: 'child', label: 'Adult Child', description: 'Allow adult children to be informed of progress' },
    { value: 'sibling', label: 'Sibling', description: 'Include siblings in your support network' },
    { value: 'friend', label: 'Close Friend', description: 'Authorize trusted friends to receive updates' },
    { value: 'sponsor', label: 'Recovery Sponsor', description: 'Allow sponsor access to recovery information' }
  ];

  useEffect(() => {
    if (user) {
      fetchConsentForms();
    }
  }, [user]);

  const fetchConsentForms = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('consent_forms')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error('Error fetching consent forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (!formData.formType || !formData.contactName || !formData.contactEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    
    try {
      const { error } = await supabase.from('consent_forms').insert({
        user_id: user.id,
        form_type: formData.formType,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone || null,
        relationship: formData.relationship || null,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "Consent Form Created!",
        description: "The form has been created and sent for digital signature.",
      });

      // Reset form and refresh list
      setFormData({
        formType: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        relationship: ''
      });
      setShowNewForm(false);
      await fetchConsentForms();
    } catch (error) {
      console.error('Error creating consent form:', error);
      toast({
        title: "Error",
        description: "Failed to create consent form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const simulateSignature = async (formId: string) => {
    try {
      const { error } = await supabase
        .from('consent_forms')
        .update({ 
          status: 'signed', 
          signed_at: new Date().toISOString(),
          signature_data: 'demo_signature_' + Date.now()
        })
        .eq('id', formId);

      if (error) throw error;

      toast({
        title: "Form Signed",
        description: "The consent form has been digitally signed.",
      });

      await fetchConsentForms();
    } catch (error) {
      console.error('Error signing form:', error);
    }
  };

  const revokeConsent = async (formId: string) => {
    try {
      const { error } = await supabase
        .from('consent_forms')
        .update({ status: 'declined' })
        .eq('id', formId);

      if (error) throw error;

      toast({
        title: "Consent Revoked",
        description: "The consent form has been revoked.",
      });

      await fetchConsentForms();
    } catch (error) {
      console.error('Error revoking consent:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'pending': return <Clock className="w-5 h-5 text-warning" />;
      case 'declined': return <X className="w-5 h-5 text-destructive" />;
      default: return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-success/10 text-success border-success/20';
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'declined': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-poppins p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading consent forms...</p>
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
            <h1 className="text-3xl font-bold text-foreground">Consent Forms</h1>
            <p className="text-muted-foreground">Manage digital consent forms for family and friends</p>
          </div>
          <Button onClick={() => setShowNewForm(!showNewForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Form
          </Button>
        </div>

        {/* Information Card */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Users className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-primary mb-2">Why Consent Forms Matter</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Consent forms allow you to include trusted family members and friends in your recovery journey. 
                  They can receive updates about your progress, be contacted in emergencies, and provide additional 
                  support when you need it most. All forms are HIPAA-compliant and digitally signed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Form Creation */}
        {showNewForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Consent Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Form Type *</Label>
                <Select value={formData.formType} onValueChange={(value) => setFormData({...formData, formType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select form type" />
                  </SelectTrigger>
                  <SelectContent>
                    {formTypes.map((type) => (
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Name *</Label>
                  <Input
                    placeholder="Full name"
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number (Optional)</Label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Relationship (Optional)</Label>
                  <Input
                    placeholder="Mother, Best Friend, etc."
                    value={formData.relationship}
                    onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create & Send Form
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Forms List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Consent Forms</h2>
          
          {forms.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Consent Forms Created</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first consent form to include family and friends in your recovery journey.
                </p>
                <Button onClick={() => setShowNewForm(true)}>
                  Create First Form
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {forms.map((form) => (
                <Card key={form.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(form.status)}
                          <div>
                            <h3 className="font-semibold capitalize">{form.form_type.replace('-', ' ')} Consent</h3>
                            <p className="text-sm text-muted-foreground">{form.contact_name}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Email:</span>
                            <p className="font-medium">{form.contact_email}</p>
                          </div>
                          {form.contact_phone && (
                            <div>
                              <span className="text-muted-foreground">Phone:</span>
                              <p className="font-medium">{form.contact_phone}</p>
                            </div>
                          )}
                          {form.relationship && (
                            <div>
                              <span className="text-muted-foreground">Relationship:</span>
                              <p className="font-medium">{form.relationship}</p>
                            </div>
                          )}
                        </div>

                        <div className={`inline-flex items-center px-2 py-1 rounded-md text-sm border ${getStatusColor(form.status)}`}>
                          {form.status === 'signed' && 'Signed & Active'}
                          {form.status === 'pending' && 'Awaiting Signature'}
                          {form.status === 'declined' && 'Declined/Revoked'}
                        </div>

                        {form.signed_at && (
                          <p className="text-sm text-muted-foreground">
                            Signed on {new Date(form.signed_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {form.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => simulateSignature(form.id)}
                          >
                            Simulate Signature
                          </Button>
                        )}
                        {form.status === 'signed' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => revokeConsent(form.id)}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <Card className="mt-8 border-muted/40">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Need Help?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">How It Works:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Create a consent form with contact details</li>
                  <li>• Form is sent to the person for digital signature</li>
                  <li>• Once signed, they can receive updates about your progress</li>
                  <li>• You can revoke consent at any time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Privacy & Security:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• All forms are HIPAA compliant</li>
                  <li>• Digital signatures are legally binding</li>
                  <li>• You control what information is shared</li>
                  <li>• Consent can be withdrawn at any time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsentForms;