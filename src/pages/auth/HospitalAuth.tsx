
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Building2, Mail, Lock, User, Phone, MapPin } from 'lucide-react';

const HospitalAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          phone,
          user_type: 'hospital',
          hospital_name: hospitalName,
          hospital_address: hospitalAddress
        });

        if (error) {
          toast({
            title: "Registration Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Registration Successful",
            description: "Please check your email to verify your account."
          });
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast({
            title: "Login Failed", 
            description: error.message,
            variant: "destructive"
          });
        } else {
          navigate('/dashboard/hospital');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-blue-900">
            {isSignUp ? 'Hospital Registration' : 'Hospital Login'}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? 'Register your hospital to join our emergency response network'
              : 'Access your hospital dashboard'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10"
                      required={isSignUp}
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10"
                      required={isSignUp}
                    />
                  </div>
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    required={isSignUp}
                  />
                </div>

                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Hospital Name"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="pl-10"
                    required={isSignUp}
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Hospital Address"
                    value={hospitalAddress}
                    onChange={(e) => setHospitalAddress(e.target.value)}
                    className="pl-10"
                    required={isSignUp}
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isSignUp ? 'Register Hospital' : 'Login')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600"
            >
              {isSignUp 
                ? 'Already have an account? Login here'
                : 'Need to register your hospital? Sign up here'
              }
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => navigate('/')}
              className="text-gray-600"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalAuth;
