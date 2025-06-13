// import React, { useState, useEffect, useRef } from 'react';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';
// import { supabase } from '@/integrations/supabase/client';
// import { MapPin, Clock, User, AlertTriangle, History } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// // ProfileModal for updating profile according to your schema
// const ProfileModal = ({ open, onClose, profile, onProfileUpdate }: any) => {
//   const [form, setForm] = useState({
//     first_name: profile?.first_name || "",
//     last_name: profile?.last_name || "",
//     phone: profile?.phone || "",
//     email: profile?.email || "",
//   });
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     setForm({
//       first_name: profile?.first_name || "",
//       last_name: profile?.last_name || "",
//       phone: profile?.phone || "",
//       email: profile?.email || "",
//     });
//   }, [profile]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     await onProfileUpdate(form);
//     setSaving(false);
//     onClose();
//   };

//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
//         <h2 className="text-lg font-bold mb-4">Update Profile</h2>
//         <div className="space-y-3">
//           <input
//             className="w-full border rounded px-3 py-2"
//             name="first_name"
//             placeholder="First Name"
//             value={form.first_name}
//             onChange={handleChange}
//           />
//           <input
//             className="w-full border rounded px-3 py-2"
//             name="last_name"
//             placeholder="Last Name"
//             value={form.last_name}
//             onChange={handleChange}
//           />
//           <input
//             className="w-full border rounded px-3 py-2"
//             name="phone"
//             placeholder="Phone"
//             value={form.phone}
//             onChange={handleChange}
//           />
//           <input
//             className="w-full border rounded px-3 py-2"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             disabled
//           />
//         </div>
//         <div className="flex justify-end gap-2 mt-4">
//           <Button variant="outline" onClick={onClose}>Cancel</Button>
//           <Button onClick={handleSave} disabled={saving}>
//             {saving ? "Saving..." : "Save"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// interface SOSRequest {
//   id: string;
//   user_id: string;
//   user_address: string | null;
//   user_latitude: number;
//   user_longitude: number;
//   assigned_hospital_id: string | null;
//   created_at: string | null;
//   updated_at: string | null;
//   estimated_arrival: string | null;
//   notes: string | null;
//   status: string;
// }

// interface Profile {
//   id: string;
//   first_name: string | null;
//   last_name: string | null;
//   phone: string | null;
//   email: string;
//   user_type: string;
// }

// const HospitalDashboard: React.FC = () => {
//   const [sosRequests, setSosRequests] = useState<SOSRequest[]>([]);
//   const [resolvedRequests, setResolvedRequests] = useState<SOSRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();
//   const [hospitalId, setHospitalId] = useState<string | null>(null);
//   const [showProfile, setShowProfile] = useState(false);
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [profileLoading, setProfileLoading] = useState(true);
//   const navigate = useNavigate();
//   const subscriptionRef = useRef<any>(null);

//   // Fetch hospital id for the logged-in user and profile
//   useEffect(() => {
//     const fetchHospitalIdAndProfile = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         // Fetch hospital id
//         const { data: hospital, error: hospitalError } = await supabase
//           .from('hospital_profiles')
//           .select('id')
//           .eq('id', user.id)
//           .single();
//         if (hospital) {
//           setHospitalId(hospital.id);
//         } else {
//           toast({
//             title: 'Profile Not Found',
//             description: 'No hospital profile found for this account.',
//             variant: 'destructive',
//           });
//           navigate('/auth/hospital');
//         }
//         // Fetch profile
//         const { data: prof, error: profError } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', user.id)
//           .single();
//         if (prof) {
//           setProfile(prof as Profile);
//         }
//         setProfileLoading(false);
//       }
//     };
//     fetchHospitalIdAndProfile();
//     // eslint-disable-next-line
//   }, []);

//   // Fetch and subscribe to SOS requests assigned to this hospital
//   useEffect(() => {
//     if (!hospitalId) return;
//     setLoading(true);

//     // Initial fetch
//     const fetchSOSRequests = async () => {
//       const { data, error } = await supabase
//         .from('sos_requests')
//         .select('*')
//         .eq('assigned_hospital_id', hospitalId)
//         .order('created_at', { ascending: false });

//       if (!error && data) {
//         setSosRequests(data.filter((req: SOSRequest) => req.status === 'active' || req.status === 'pending'));
//         setResolvedRequests(data.filter((req: SOSRequest) => req.status === 'resolved'));
//       }
//       setLoading(false);
//     };

//     fetchSOSRequests();

//     // Clean up previous subscription if any
//     if (subscriptionRef.current) {
//       supabase.removeChannel(subscriptionRef.current);
//       subscriptionRef.current = null;
//     }

//     // Real-time subscription
//     const channel = supabase
//       .channel('realtime:sos_requests')
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'sos_requests',
//           filter: `assigned_hospital_id=eq.${hospitalId}`,
//         },
//         (payload) => {
//           setSosRequests((prev) => {
//             let updated = prev;
//             if (payload.eventType === 'INSERT') {
//               if (payload.new.status === 'active' || payload.new.status === 'pending') {
//                 if (!prev.some((req) => req.id === payload.new.id)) {
//                   updated = [payload.new as SOSRequest, ...prev];
//                 }
//               }
//             } else if (payload.eventType === 'UPDATE') {
//               if (payload.new.status !== 'active' && payload.new.status !== 'pending') {
//                 updated = prev.filter((req) => req.id !== payload.new.id);
//               } else {
//                 updated = prev.map((req) =>
//                   req.id === payload.new.id ? (payload.new as SOSRequest) : req
//                 );
//               }
//             } else if (payload.eventType === 'DELETE') {
//               updated = prev.filter((req) => req.id !== payload.old.id);
//             }
//             return updated;
//           });
//           setResolvedRequests((prev) => {
//             let updated = prev;
//             if (payload.eventType === 'INSERT') {
//               if (payload.new.status === 'resolved') {
//                 if (!prev.some((req) => req.id === payload.new.id)) {
//                   updated = [payload.new as SOSRequest, ...prev];
//                 }
//               }
//             } else if (payload.eventType === 'UPDATE') {
//               if (payload.new.status === 'resolved') {
//                 if (!prev.some((req) => req.id === payload.new.id)) {
//                   updated = [payload.new as SOSRequest, ...prev];
//                 }
//               } else {
//                 updated = prev.filter((req) => req.id !== payload.new.id);
//               }
//             } else if (payload.eventType === 'DELETE') {
//               updated = prev.filter((req) => req.id !== payload.old.id);
//             }
//             return updated;
//           });
//         }
//       )
//       .subscribe();

//     subscriptionRef.current = channel;

//     return () => {
//       if (subscriptionRef.current) {
//         supabase.removeChannel(subscriptionRef.current);
//         subscriptionRef.current = null;
//       }
//     };
//   }, [hospitalId, toast]);

//   const formatTime = (timestamp: string | null) => {
//     if (!timestamp) return "";
//     const date = new Date(timestamp);
//     return date.toLocaleString();
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'active': return 'text-red-600 bg-red-50';
//       case 'pending': return 'text-yellow-600 bg-yellow-50';
//       case 'resolved': return 'text-green-600 bg-green-50';
//       default: return 'text-gray-600 bg-gray-50';
//     }
//   };

//   // Immediate UI update on status change (optimistic)
//   const handleStatusUpdate = async (id: string, status: string) => {
//     setSosRequests((prev) =>
//       prev
//         .map((req) => (req.id === id ? { ...req, status } : req))
//         .filter((req) => req.status === 'active' || req.status === 'pending')
//     );
//     if (status === 'resolved') {
//       setResolvedRequests((prev) => [
//         ...prev,
//         sosRequests.find((req) => req.id === id) as SOSRequest,
//       ]);
//     }
//     const { error } = await supabase
//       .from('sos_requests')
//       .update({ status })
//       .eq('id', id);

//     if (error) {
//       toast({
//         title: 'Error',
//         description: 'Could not update status.',
//         variant: 'destructive',
//       });
//     } else {
//       toast({
//         title: 'Status Updated',
//         description: `Request marked as ${status}.`,
//       });
//     }
//   };

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     navigate('/auth/hospital');
//   };

//   const handleProfileUpdate = async (updated: any) => {
//     if (!profile) return;
//     const { error } = await supabase
//       .from('profiles')
//       .update({
//         first_name: updated.first_name,
//         last_name: updated.last_name,
//         phone: updated.phone,
//       })
//       .eq('id', profile.id);
//     if (!error) {
//       setProfile({ ...profile, ...updated });
//       toast({ title: "Profile Updated", description: "Your profile has been updated." });
//     } else {
//       toast({ title: "Error", description: "Could not update profile.", variant: "destructive" });
//     }
//   };

//   if (loading || profileLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }


//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <span className="text-xl font-bold">Hospital Dashboard</span>
//              {profile?.first_name && (
//     <span className="text-lg font-semibold text-gray-700">| {profile.first_name}</span>
//   )}
//           </div>
//           <div className="flex items-center space-x-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setShowProfile(true)}
//             >
//               <User className="h-4 w-4 mr-2" />
//               Profile
//             </Button>
//             <Button variant="outline" onClick={signOut}>
//               Logout
//             </Button>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-6xl mx-auto p-4">
//         <Tabs defaultValue="emergency" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="emergency">Emergency</TabsTrigger>
//             <TabsTrigger value="history">History</TabsTrigger>
//           </TabsList>

//           <TabsContent value="emergency" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <AlertTriangle className="h-5 w-5 text-red-600" />
//                   <span>Emergency Requests</span>
//                 </CardTitle>
//                 <CardDescription>
//                   {sosRequests.length === 0
//                     ? 'No emergency requests assigned to your hospital'
//                     : `${sosRequests.length} total requests`}
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
//                     {sosRequests.map((request) => (
//                       <div key={request.id} className="border rounded-lg p-4 space-y-3">
//                         <div className="flex items-start justify-between">
//                           <div className="space-y-2">
//                             <div className="flex items-center space-x-2">
//                               <User className="h-4 w-4" />
//                               <span className="font-medium">User ID: {request.user_id}</span>
//                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
//                                 {request.status.toUpperCase()}
//                               </span>
//                             </div>
//                             <div className="text-sm text-gray-600">
//                               <span className="font-medium">User Address: </span>
//                               {request.user_address || 'N/A'}
//                             </div>
//                             <div className="flex items-center space-x-4 text-sm text-gray-600">
//                               <div className="flex items-center space-x-2">
//                                 <MapPin className="h-4 w-4 text-red-500" />
//                                 <span className="text-sm text-gray-700">
//                                   {request.user_latitude?.toFixed(6)}, {request.user_longitude?.toFixed(6)}
//                                 </span>
                                // <a
                                //   href={`https://www.google.com/maps?q=${request.user_latitude},${request.user_longitude}`}
                                //   target="_blank"
                                //   rel="noopener noreferrer"
                                //   className="flex items-center justify-center p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                //   title="Navigate on Google Maps"
                                // >
                                //   <MapPin className="h-4 w-4" />
                                // </a>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <Clock className="h-4 w-4" />
//                                 <span>{formatTime(request.created_at)}</span>
//                               </div>
//                             </div>
//                             {request.notes && (
//                               <div className="text-sm text-gray-600">
//                                 <span className="font-medium">Notes: </span>
//                                 {request.notes}
//                               </div>
//                             )}
//                             {request.estimated_arrival && (
//                               <div className="text-sm text-gray-600">
//                                 <span className="font-medium">Estimated Arrival: </span>
//                                 {request.estimated_arrival}
//                               </div>
//                             )}
//                           </div>
//                           <div className="flex flex-col gap-2">
//                             <Button
//                               size="sm"
//                               className="bg-green-600 hover:bg-green-700 text-white"
//                               onClick={() => handleStatusUpdate(request.id, 'resolved')}
//                             >
//                               Resolve
//                             </Button>
//                             <Button
//                               size="sm"
//                               className="bg-gray-400 hover:bg-gray-500 text-white"
//                               onClick={() => handleStatusUpdate(request.id, 'dismissed')}
//                             >
//                               Dismiss
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="history" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <History className="h-5 w-5 text-green-600" />
//                   <span>History</span>
//                 </CardTitle>
//                 <CardDescription>
//                   {resolvedRequests.length === 0
//                     ? 'No resolved requests yet'
//                     : `${resolvedRequests.length} resolved requests`}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {resolvedRequests.length === 0 ? (
//                   <div className="text-center py-8">
//                     <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                     <p className="text-gray-500">No resolved requests to display</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {resolvedRequests.map((request) => (
//                       <div key={request.id} className="border rounded-lg p-4 space-y-3">
//                         <div className="flex items-start justify-between">
//                           <div className="space-y-2">
//                             <div className="flex items-center space-x-2">
//                               <User className="h-4 w-4" />
//                               <span className="font-medium">User ID: {request.user_id}</span>
//                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
//                                 {request.status.toUpperCase()}
//                               </span>
//                             </div>
//                             <div className="text-sm text-gray-600">
//                               <span className="font-medium">User Address: </span>
//                               {request.user_address || 'N/A'}
//                             </div>
//                             <div className="flex items-center space-x-4 text-sm text-gray-600">
//                               <div className="flex items-center space-x-1">
//                                 <MapPin className="h-4 w-4" />
//                                 <span>
//                                   {request.user_latitude?.toFixed(6)}, {request.user_longitude?.toFixed(6)}
//                                 </span>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <Clock className="h-4 w-4" />
//                                 <span>{formatTime(request.created_at)}</span>
//                               </div>
//                             </div>
//                             {request.notes && (
//                               <div className="text-sm text-gray-600">
//                                 <span className="font-medium">Notes: </span>
//                                 {request.notes}
//                               </div>
//                             )}
//                             {request.estimated_arrival && (
//                               <div className="text-sm text-gray-600">
//                                 <span className="font-medium">Estimated Arrival: </span>
//                                 {request.estimated_arrival}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>

//       <ProfileModal
//         open={showProfile}
//         onClose={() => setShowProfile(false)}
//         profile={profile}
//         onProfileUpdate={handleProfileUpdate}
//       />
//     </div>
//   );
// };

// export default HospitalDashboard;


import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Clock, User, AlertTriangle, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ProfileModal for updating profile according to your schema
const ProfileModal = ({ open, onClose, profile, onProfileUpdate }: any) => {
  const [form, setForm] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    email: profile?.email || "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      phone: profile?.phone || "",
      email: profile?.email || "",
    });
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    await onProfileUpdate(form);
    setSaving(false);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">Update Profile</h2>
        <div className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
          />
          <input
            className="w-full border rounded px-3 py-2"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
          />
          <input
            className="w-full border rounded px-3 py-2"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            className="w-full border rounded px-3 py-2"
            name="email"
            placeholder="Email"
            value={form.email}
            disabled
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface SOSRequest {
  id: string;
  user_id: string;
  user_address: string | null;
  user_latitude: number;
  user_longitude: number;
  assigned_hospital_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  estimated_arrival: string | null;
  notes: string | null;
  status: string;
}

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string;
  user_type: string;
}

const HospitalDashboard: React.FC = () => {
  const [sosRequests, setSosRequests] = useState<SOSRequest[]>([]);
  const [historyRequests, setHistoryRequests] = useState<SOSRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();
  const subscriptionRef = useRef<any>(null);

  // Fetch hospital id for the logged-in user and profile
  useEffect(() => {
    const fetchHospitalIdAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch hospital id
        const { data: hospital, error: hospitalError } = await supabase
          .from('hospital_profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        if (hospital) {
          setHospitalId(hospital.id);
        } else {
          toast({
            title: 'Profile Not Found',
            description: 'No hospital profile found for this account.',
            variant: 'destructive',
          });
          navigate('/auth/hospital');
        }
        // Fetch profile
        const { data: prof, error: profError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (prof) {
          setProfile(prof as Profile);
        }
        setProfileLoading(false);
      }
    };
    fetchHospitalIdAndProfile();
    // eslint-disable-next-line
  }, []);

  // Fetch and subscribe to SOS requests assigned to this hospital
  useEffect(() => {
    if (!hospitalId) return;
    setLoading(true);

    // Initial fetch
    const fetchSOSRequests = async () => {
      const { data, error } = await supabase
        .from('sos_requests')
        .select('*')
        .eq('assigned_hospital_id', hospitalId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSosRequests(data.filter((req: SOSRequest) => req.status === 'active' || req.status === 'pending'));
        setHistoryRequests(
          data.filter(
            (req: SOSRequest) =>
              req.status === 'resolved' || req.status === 'dismissed'
          )
        );
      }
      setLoading(false);
    };

    fetchSOSRequests();

    // Clean up previous subscription if any
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    // Real-time subscription
    const channel = supabase
      .channel('realtime:sos_requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sos_requests',
          filter: `assigned_hospital_id=eq.${hospitalId}`,
        },
        (payload) => {
          setSosRequests((prev) => {
            let updated = prev;
            if (payload.eventType === 'INSERT') {
              if (payload.new.status === 'active' || payload.new.status === 'pending') {
                if (!prev.some((req) => req.id === payload.new.id)) {
                  updated = [payload.new as SOSRequest, ...prev];
                }
              }
            } else if (payload.eventType === 'UPDATE') {
              if (payload.new.status !== 'active' && payload.new.status !== 'pending') {
                updated = prev.filter((req) => req.id !== payload.new.id);
              } else {
                updated = prev.map((req) =>
                  req.id === payload.new.id ? (payload.new as SOSRequest) : req
                );
              }
            } else if (payload.eventType === 'DELETE') {
              updated = prev.filter((req) => req.id !== payload.old.id);
            }
            return updated;
          });
          setHistoryRequests((prev) => {
            let updated = prev;
            if (payload.eventType === 'INSERT') {
              if (
                payload.new.status === 'resolved' ||
                payload.new.status === 'dismissed'
              ) {
                if (!prev.some((req) => req.id === payload.new.id)) {
                  updated = [payload.new as SOSRequest, ...prev];
                }
              }
            } else if (payload.eventType === 'UPDATE') {
              if (
                payload.new.status === 'resolved' ||
                payload.new.status === 'dismissed'
              ) {
                if (!prev.some((req) => req.id === payload.new.id)) {
                  updated = [payload.new as SOSRequest, ...prev];
                }
              } else {
                updated = prev.filter((req) => req.id !== payload.new.id);
              }
            } else if (payload.eventType === 'DELETE') {
              updated = prev.filter((req) => req.id !== payload.old.id);
            }
            return updated;
          });
        }
      )
      .subscribe();

    subscriptionRef.current = channel;

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [hospitalId, toast]);

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'dismissed': return 'text-gray-600 bg-gray-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Immediate UI update on status change (optimistic)
  const handleStatusUpdate = async (id: string, status: string) => {
    setSosRequests((prev) =>
      prev
        .map((req) => (req.id === id ? { ...req, status } : req))
        .filter((req) => req.status === 'active' || req.status === 'pending')
    );
    if (status === 'resolved' || status === 'dismissed') {
      setHistoryRequests((prev) => [
        ...prev,
        sosRequests.find((req) => req.id === id) as SOSRequest,
      ]);
    }
    const { error } = await supabase
      .from('sos_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Could not update status.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Status Updated',
        description: `Request marked as ${status}.`,
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth/hospital');
  };

  const handleProfileUpdate = async (updated: any) => {
    if (!profile) return;
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: updated.first_name,
        last_name: updated.last_name,
        phone: updated.phone,
      })
      .eq('id', profile.id);
    if (!error) {
      setProfile({ ...profile, ...updated });
      toast({ title: "Profile Updated", description: "Your profile has been updated." });
    } else {
      toast({ title: "Error", description: "Could not update profile.", variant: "destructive" });
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">Hospital Dashboard</span>
            {profile?.first_name && (
              <span className="text-lg font-semibold text-gray-700">| {profile.first_name}</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProfile(true)}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" onClick={signOut}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="emergency" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="emergency" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Emergency Requests</span>
                </CardTitle>
                <CardDescription>
                  {sosRequests.length === 0
                    ? 'No emergency requests assigned to your hospital'
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
                    {sosRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">User ID: {request.user_id}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">User Address: </span>
                              {request.user_address || 'N/A'}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {request.user_latitude?.toFixed(6)}, {request.user_longitude?.toFixed(6)}
                                </span>
                                <a
                                  href={`https://www.google.com/maps?q=${request.user_latitude},${request.user_longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                  title="Navigate on Google Maps"
                                >
                                  <MapPin className="h-4 w-4" />
                                </a>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatTime(request.created_at)}</span>
                              </div>
                            </div>
                            {request.notes && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Notes: </span>
                                {request.notes}
                              </div>
                            )}
                            {request.estimated_arrival && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Estimated Arrival: </span>
                                {request.estimated_arrival}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleStatusUpdate(request.id, 'resolved')}
                            >
                              Resolve
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gray-400 hover:bg-gray-500 text-white"
                              onClick={() => handleStatusUpdate(request.id, 'dismissed')}
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-green-600" />
                  <span>History</span>
                </CardTitle>
                <CardDescription>
                  {historyRequests.length === 0
                    ? 'No resolved or dismissed requests yet'
                    : `${historyRequests.length} resolved/dismissed requests`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {historyRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No resolved or dismissed requests to display</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {historyRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">User ID: {request.user_id}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">User Address: </span>
                              {request.user_address || 'N/A'}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {request.user_latitude?.toFixed(6)}, {request.user_longitude?.toFixed(6)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatTime(request.created_at)}</span>
                              </div>
                            </div>
                            {request.notes && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Notes: </span>
                                {request.notes}
                              </div>
                            )}
                            {request.estimated_arrival && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Estimated Arrival: </span>
                                {request.estimated_arrival}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
        profile={profile}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default HospitalDashboard;