import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  MapPin,
  Clock,
  Phone,
  User,
  AlertTriangle,
  Hospital,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ResolvedHistory from '@/components/ResolvedHistory';
import { useNavigate } from 'react-router-dom';
import HospitalProfile from '@/components/HospitalProfile';

interface SOSRequest {
  id: string;
  user_name: string;
  user_phone: string;
  latitude: number;
  longitude: number;
  emergency_type: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string | null;
}

const HospitalDashboard: React.FC = () => {
  const [sosRequests, setSosRequests] = useState<SOSRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  const { user, profile, signOut } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchSOSRequests();

    const channel = supabase
      .channel('sos-requests-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_requests' }, (payload) => {
        const newRequest = payload.new as SOSRequest;
        setSosRequests(prev => [newRequest, ...prev]);
        toast({
          title: 'New Emergency Alert!',
          description: `Emergency request from ${newRequest.user_name}`,
          variant: 'destructive',
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sos_requests' }, (payload) => {
        const updatedRequest = payload.new as SOSRequest;
        setSosRequests(prev =>
          prev.map(req => (req.id === updatedRequest.id ? updatedRequest : req))
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const fetchSOSRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('sos_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setSosRequests(data as SOSRequest[]);
    } catch (error) {
      console.error('Error fetching SOS requests:', error);
      toast({
        title: 'Error',
        description: 'Could not load emergency requests.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('sos_requests')
        .update({ status: 'responded' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: 'Response Sent',
        description: 'You have responded to this emergency request.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not send response. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleResolve = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('sos_requests')
        .update({ status: 'resolved' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: 'Request Resolved',
        description: 'Emergency request has been marked as resolved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not resolve request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-50';
      case 'responded': return 'text-yellow-600 bg-yellow-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const hospitalName = profile?.hospital_details?.[0]?.hospital_name ||
    `${profile?.first_name} ${profile?.last_name}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading emergency requests...</p>
        </div>
      </div>
    );
  }




  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <span className="text-xl font-bold">Hospital Dashboard</span>
              {hospitalName && (
                <span className="text-gray-600">- {hospitalName}</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
               

              <Button variant="outline" onClick={signOut}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Tabs */}
        <div className="flex gap-4 justify-end">
          <Button
            variant={!showHistory ? 'default' : 'outline'}
            onClick={() => setShowHistory(false)}
          >
            Emergency
          </Button>
          <Button
            variant={showHistory ? 'default' : 'outline'}
            onClick={() => setShowHistory(true)}
          >
            History
          </Button>
        </div>

        {/* Emergency Stats & Requests */}
        {!showHistory && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {sosRequests.filter(req => req.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Emergencies</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {sosRequests.filter(req => req.status === 'responded').length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {sosRequests.filter(req => req.status === 'resolved').length}
                  </div>
                  <div className="text-sm text-gray-600">Resolved Today</div>
                </CardContent>
              </Card>
            </div>

            {/* Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Emergency Requests</span>
                </CardTitle>
                <CardDescription>
                  {sosRequests.length === 0
                    ? 'No emergency requests at this time'
                    : `${sosRequests.length} total requests`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sosRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No emergency requests to display</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sosRequests
                      .filter(req => req.status !== 'resolved')
                      .map((request) => (
                        <div key={request.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span className="font-medium">{request.user_name}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                  {request.status.toUpperCase()}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Emergency Type: </span>
                                {request.emergency_type}
                              </div>
                              {request.description && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Description: </span>
                                  {request.description}
                                </div>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatTime(request.created_at)}</span>
                                </div>
                                {request.user_phone && (
                                  <div className="flex items-center space-x-1">
                                    <Phone className="h-4 w-4" />
                                    <span>{request.user_phone}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{request.latitude.toFixed(6)}, {request.longitude.toFixed(6)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              {request.status === 'active' && (
                                <Button
                                  onClick={() => handleRespond(request.id)}
                                  className="bg-yellow-600 hover:bg-yellow-700"
                                  size="sm"
                                >
                                  Respond
                                </Button>
                              )}
                              {request.status !== 'resolved' && (
                                <Button
                                  onClick={() => handleResolve(request.id)}
                                  variant="outline"
                                  size="sm"
                                >
                                  Mark Resolved
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* History View */}
        {showHistory && (
          <div className="pt-4">
            <ResolvedHistory />
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;
// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';
// import { useAuth } from '@/hooks/useAuth';
// import {
//   MapPin,
//   Clock,
//   Phone,
//   User,
//   AlertTriangle,
//   Hospital,
// } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
// import ResolvedHistory from '@/components/ResolvedHistory';
// import { useNavigate } from 'react-router-dom';
// import HospitalProfile from '@/components/HospitalProfile';

// interface SOSRequest {
//   id: string;
//   user_name: string;
//   user_phone: string;
//   latitude: number;
//   longitude: number;
//   emergency_type: string;
//   description: string | null;
//   status: string;
//   created_at: string;
//   updated_at: string | null;
//   responder_hospital_id?: string;
// }

// function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
//   const deg2rad = (deg: number) => deg * (Math.PI / 180);
//   const R = 6371; // Radius of earth in km
//   const dLat = deg2rad(lat2 - lat1);
//   const dLon = deg2rad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// const HospitalDashboard: React.FC = () => {
//   const [sosRequests, setSosRequests] = useState<SOSRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showHistory, setShowHistory] = useState(false);
//   const { toast } = useToast();
//   const { user, profile, signOut } = useAuth();
//   const [showProfile, setShowProfile] = useState(false);

//   useEffect(() => {
//     fetchSOSRequests();

//     const channel = supabase
//       .channel('sos-requests-changes')
//       .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_requests' }, (payload) => {
//         const newRequest = payload.new as SOSRequest;
//         const hospitalLat = profile?.hospital_details?.[0]?.latitude;
//         const hospitalLng = profile?.hospital_details?.[0]?.longitude;
//         if (!hospitalLat || !hospitalLng) return;
//         const distance = getDistanceFromLatLonInKm(hospitalLat, hospitalLng, newRequest.latitude, newRequest.longitude);
//         if (distance <= 5 && newRequest.status !== 'resolved') {
//           setSosRequests(prev => [newRequest, ...prev]);
//           toast({
//             title: 'New Emergency Alert!',
//             description: `Emergency request from ${newRequest.user_name}`,
//             variant: 'destructive',
//           });
//         }
//       })
//       .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sos_requests' }, (payload) => {
//         const updatedRequest = payload.new as SOSRequest;
//         setSosRequests(prev =>
//           prev.map(req => (req.id === updatedRequest.id ? updatedRequest : req))
//         );
//       })
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [toast, profile]);

//   const fetchSOSRequests = async () => {
//     try {
//       if (!profile || profile.user_type !== 'hospital') return;

//       const hospitalLat = profile.hospital_details?.[0]?.latitude;
//       const hospitalLng = profile.hospital_details?.[0]?.longitude;

//       if (!hospitalLat || !hospitalLng) throw new Error("Hospital location missing");

//       const { data, error } = await supabase
//         .from('sos_requests')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       const filteredRequests = (data as SOSRequest[]).filter(req => {
//         const distance = getDistanceFromLatLonInKm(hospitalLat, hospitalLng, req.latitude, req.longitude);
//         return distance <= 5 && (req.status !== 'resolved' || req.responder_hospital_id === profile.user_id);
//       });

//       setSosRequests(filteredRequests);
//     } catch (error) {
//       console.error('Error fetching SOS requests:', error);
//       toast({
//         title: 'Error',
//         description: 'Could not load emergency requests.',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRespond = async (requestId: string) => {
//     try {
//       const { error } = await supabase
//         .from('sos_requests')
//         .update({ status: 'responded', responder_hospital_id: profile?.user_id })
//         .eq('id', requestId);

//       if (error) throw error;

//       toast({
//         title: 'Response Sent',
//         description: 'You have responded to this emergency request.',
//       });

//       fetchSOSRequests();
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Could not send response. Please try again.',
//         variant: 'destructive',
//       });
//     }
//   };

//   const handleResolve = async (requestId: string) => {
//     try {
//       const { error } = await supabase
//         .from('sos_requests')
//         .update({ status: 'resolved' })
//         .eq('id', requestId);

//       if (error) throw error;

//       toast({
//         title: 'Request Resolved',
//         description: 'Emergency request has been marked as resolved.',
//       });
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Could not resolve request. Please try again.',
//         variant: 'destructive',
//       });
//     }
//   };

//   const formatTime = (timestamp: string) => {
//     const date = new Date(timestamp);
//     return date.toLocaleString();
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'active': return 'text-red-600 bg-red-50';
//       case 'responded': return 'text-yellow-600 bg-yellow-50';
//       case 'resolved': return 'text-green-600 bg-green-50';
//       default: return 'text-gray-600 bg-gray-50';
//     }
//   };

//   const hospitalName = profile?.hospital_details?.[0]?.hospital_name ||
//     `${profile?.first_name} ${profile?.last_name}`;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading emergency requests...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <AlertTriangle className="h-6 w-6 text-red-600" />
//               <span className="text-xl font-bold">Hospital Dashboard</span>
//               {hospitalName && <span className="text-gray-600">- {hospitalName}</span>}
//             </div>
//             <div className="flex items-center space-x-4">
//               <Button variant="outline" onClick={signOut}>Logout</Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-6xl mx-auto p-4 space-y-6">
//         <div className="flex gap-4 justify-end">
//           <Button variant={!showHistory ? 'default' : 'outline'} onClick={() => setShowHistory(false)}>Emergency</Button>
//           <Button variant={showHistory ? 'default' : 'outline'} onClick={() => setShowHistory(true)}>History</Button>
//         </div>

//         {!showHistory && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Card>
//                 <CardContent className="p-4 text-center">
//                   <div className="text-2xl font-bold text-red-600">
//                     {sosRequests.filter(req => req.status === 'active').length}
//                   </div>
//                   <div className="text-sm text-gray-600">Active Emergencies</div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardContent className="p-4 text-center">
//                   <div className="text-2xl font-bold text-yellow-600">
//                     {sosRequests.filter(req => req.status === 'responded').length}
//                   </div>
//                   <div className="text-sm text-gray-600">In Progress</div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardContent className="p-4 text-center">
//                   <div className="text-2xl font-bold text-green-600">
//                     {sosRequests.filter(req => req.status === 'resolved').length}
//                   </div>
//                   <div className="text-sm text-gray-600">Resolved Today</div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <AlertTriangle className="h-5 w-5 text-red-600" />
//                   <span>Emergency Requests</span>
//                 </CardTitle>
//                 <CardDescription>
//                   {sosRequests.length === 0 ? 'No emergency requests at this time' : `${sosRequests.length} total requests`}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {sosRequests.length === 0 ? (
//                   <div className="text-center py-8">
//                     <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                     <p className="text-gray-500">No emergency requests to display</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {sosRequests.filter(req => req.status !== 'resolved').map((request) => (
//                       <div key={request.id} className="border rounded-lg p-4 space-y-3">
//                         <div className="flex items-start justify-between">
//                           <div className="space-y-2">
//                             <div className="flex items-center space-x-2">
//                               <User className="h-4 w-4" />
//                               <span className="font-medium">{request.user_name}</span>
//                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
//                                 {request.status.toUpperCase()}
//                               </span>
//                             </div>
//                             <div className="text-sm text-gray-600">
//                               <span className="font-medium">Emergency Type: </span>{request.emergency_type}
//                             </div>
//                             {request.description && (
//                               <div className="text-sm text-gray-600">
//                                 <span className="font-medium">Description: </span>{request.description}
//                               </div>
//                             )}
//                             <div className="flex items-center space-x-4 text-sm text-gray-600">
//                               <div className="flex items-center space-x-1">
//                                 <Clock className="h-4 w-4" /><span>{formatTime(request.created_at)}</span>
//                               </div>
//                               {request.user_phone && (
//                                 <div className="flex items-center space-x-1">
//                                   <Phone className="h-4 w-4" /><span>{request.user_phone}</span>
//                                 </div>
//                               )}
//                               <div className="flex items-center space-x-1">
//                                 <MapPin className="h-4 w-4" /><span>{request.latitude.toFixed(6)}, {request.longitude.toFixed(6)}</span>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex space-x-2">
//                             {request.status === 'active' && (
//                               <Button onClick={() => handleRespond(request.id)} className="bg-yellow-600 hover:bg-yellow-700" size="sm">Respond</Button>
//                             )}
//                             {request.status !== 'resolved' && (
//                               <Button onClick={() => handleResolve(request.id)} variant="outline" size="sm">Mark Resolved</Button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </>
//         )}

//         {showHistory && (
//           <div className="pt-4">
//             <ResolvedHistory />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default HospitalDashboard;