
// // import { useState } from 'react';
// // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// // import { Textarea } from '@/components/ui/textarea';
// // import { useHospitalSOS } from '@/hooks/useHospitalSOS';
// // import { useAuth } from '@/hooks/useAuth';
// // import { Ambulance } from 'lucide-react';

// // interface HospitalSOSDialogProps {
// //   userLocation: { lat: number; lng: number } | null;
// //   trigger?: React.ReactNode;
// // }

// // export const HospitalSOSDialog = ({ userLocation, trigger }: HospitalSOSDialogProps) => {
// //   const [open, setOpen] = useState(false);
// //   const [emergencyType, setEmergencyType] = useState('');
// //   const [description, setDescription] = useState('');
// //   const [userPhone, setUserPhone] = useState('');
  
// //   const { sendHospitalSOS, loading } = useHospitalSOS();
// //   const { profile } = useAuth();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     if (!userLocation) {
// //       return;
// //     }

// //     if (!emergencyType || !userPhone) {
// //       return;
// //     }

// //     const userName = profile ? `${profile.first_name} ${profile.last_name}` : 'Anonymous User';

// //     await sendHospitalSOS({
// //       user_name: userName,
// //       user_phone: userPhone,
// //       latitude: userLocation.lat,
// //       longitude: userLocation.lng,
// //       emergency_type: emergencyType,
// //       description: description || `${emergencyType} emergency assistance needed`
// //     });

// //     setOpen(false);
// //     setEmergencyType('');
// //     setDescription('');
// //     setUserPhone('');
// //   };

// //   return (
// //     <Dialog open={open} onOpenChange={setOpen}>
// //       <DialogTrigger asChild>
// //         {trigger || (
// //           <Button variant="outline" disabled={!userLocation}>
// //             <Ambulance className="h-4 w-4 mr-2" />
// //             Find Hospital
// //           </Button>
// //         )}
// //       </DialogTrigger>
// //       <DialogContent className="sm:max-w-[425px]">
// //         <DialogHeader>
// //           <DialogTitle>Emergency Hospital Request</DialogTitle>
// //           <DialogDescription>
// //             Send an emergency request to nearby hospitals within 5km radius.
// //           </DialogDescription>
// //         </DialogHeader>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div>
// //             <Label htmlFor="emergency-type">Emergency Type</Label>
// //             <Select value={emergencyType} onValueChange={setEmergencyType} required>
// //               <SelectTrigger>
// //                 <SelectValue placeholder="Select emergency type" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="medical">Medical Emergency</SelectItem>
// //                 <SelectItem value="accident">Accident</SelectItem>
// //                 <SelectItem value="cardiac">Cardiac Emergency</SelectItem>
// //                 <SelectItem value="trauma">Trauma</SelectItem>
// //                 <SelectItem value="other">Other</SelectItem>
// //               </SelectContent>
// //             </Select>
// //           </div>

// //           <div>
// //             <Label htmlFor="phone">Your Phone Number</Label>
// //             <Input
// //               id="phone"
// //               type="tel"
// //               value={userPhone}
// //               onChange={(e) => setUserPhone(e.target.value)}
// //               placeholder="+1 (555) 123-4567"
// //               required
// //             />
// //           </div>

// //           <div>
// //             <Label htmlFor="description">Additional Details (Optional)</Label>
// //             <Textarea
// //               id="description"
// //               value={description}
// //               onChange={(e) => setDescription(e.target.value)}
// //               placeholder="Describe the emergency situation..."
// //               rows={3}
// //             />
// //           </div>

// //           <div className="flex justify-end space-x-2">
// //             <Button type="button" variant="outline" onClick={() => setOpen(false)}>
// //               Cancel
// //             </Button>
// //             <Button type="submit" disabled={loading || !userLocation} className="bg-red-600 hover:bg-red-700">
// //               {loading ? 'Sending...' : 'Send Emergency Request'}
// //             </Button>
// //           </div>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // };
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { useHospitalSOS } from '@/hooks/useHospitalSOS';
// import { useAuth } from '@/hooks/useAuth';
// import { Ambulance } from 'lucide-react';

// interface HospitalSOSDialogProps {
//   userLocation: { lat: number; lng: number } | null;
// }

// export const HospitalSOSDialog = ({ userLocation }: HospitalSOSDialogProps) => {
//   const { sendHospitalSOS, loading } = useHospitalSOS();
//   const { profile } = useAuth();
//   const [sent, setSent] = useState(false);

//   const handleAutoSendSOS = async () => {
//     if (!userLocation || !profile?.phone) {
//       console.error('User location or phone number missing.');
//       return;
//     }

//     const userName = profile.first_name && profile.last_name
//       ? `${profile.first_name} ${profile.last_name}`
//       : 'Anonymous User';

//     await sendHospitalSOS({
//       user_name: userName,
//       user_phone: profile.phone,
//       latitude: userLocation.lat,
//       longitude: userLocation.lng,
//       emergency_type: 'medical',
//       description: 'Medical emergency assistance needed'
//     });

//     setSent(true);
//   };

//   return (
//     <Button
//       variant="outline"
//       disabled={!userLocation || loading || sent}
//       onClick={handleAutoSendSOS}
//       className="bg-red-600 hover:bg-red-700 text-white"
//     >
//       <Ambulance className="h-4 w-4 mr-2" />
//       {loading ? 'Sending...' : sent ? 'Request Sent' : 'super-fast Hospital SOS'}
//     </Button>
//   );
// };
