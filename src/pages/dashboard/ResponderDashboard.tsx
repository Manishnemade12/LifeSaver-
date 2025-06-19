
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Shield, MapPin, Clock, Users, Ambulance, Phone, History, Flag, Navigation, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEmergencyAlerts } from "@/hooks/useEmergencyAlerts";
import { useResponderData } from "@/hooks/useResponderData";
import { useResponderLocation } from "@/hooks/useResponderLocation";
import { ResponderStatsCards } from "@/components/ResponderStatsCards";
import { NavigationButton } from "@/components/NavigationButton";
import { AnonymousReportsManager } from "@/components/AnonymousReportsManager";
import ResponderProfile from "@/components/ResponderProfile";
import ResponderReportsManagement from "@/components/ResponderReportsManagement";
import EmergencyMap from "@/components/r/map";


const ResponderDashboard = () => {
  const { profile, signOut } = useAuth();
  const { alerts, acknowledgeAlert, respondToAlert, completeAlert, loading: alertsLoading } = useEmergencyAlerts();
  const { onDuty, updateDutyStatus, loading: responderLoading } = useResponderData();
  const { currentLocation, locationError, calculateDistance } = useResponderLocation();
  const [showProfile, setShowProfile] = useState(false);

  const contactUser = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "medical": return "bg-red-100 text-red-800";
      case "safety": return "bg-orange-100 text-orange-800";
      case "general": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-red-100 text-red-800";
      case "acknowledged": return "bg-yellow-100 text-yellow-800";
      case "responding": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "medical": return <Ambulance className="h-4 w-4" />;
      case "safety": return <Shield className="h-4 w-4" />;
      case "general": return <Flag className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

const getDistanceToAlert = (alert: any) => {
    if (!currentLocation || !alert.location_lat || !alert.location_lng) return null;

    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      alert.location_lat,
      alert.location_lng
    );
    return distance.toFixed(1) + " km";
  };

  const filterAlertsWithinRadius = (alerts: any[]) => {
  if (!currentLocation) return [];

  return alerts.filter(alert => {
    if (!alert.location_lat || !alert.location_lng) return false;
    
    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      alert.location_lat,
      alert.location_lng
    );

    return distance <= 50; // sirf 50km ke andar ke alerts
  });
};

  // Filter alerts based on responder verification status and duty status
 const visibleAlerts = profile?.responder_details?.is_verified && onDuty
    ? filterAlertsWithinRadius(alerts.filter(alert => alert.status !== 'completed'))
    : [];

  const responderHistory = alerts.filter(alert => alert.responder_id === profile?.id);

  if (alertsLoading || responderLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
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
              <Shield className="h-6 w-6 text-red-600" />
              <span className="text-xl font-bold">Responder Dashboard</span>
              {profile && (
                <span className="text-gray-600">
                  - {profile.first_name} {profile.last_name} ({profile.responder_details?.responder_type})
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {profile?.responder_details?.is_verified && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Off Duty</span>
                  <Switch
                    checked={onDuty}
                    onCheckedChange={updateDutyStatus}
                  />
                  <span className="text-sm">On Duty</span>
                </div>
              )}
              <Badge variant={onDuty ? "default" : "secondary"} className={onDuty ? "bg-green-600" : ""}>
                {onDuty ? "ON DUTY" : "OFF DUTY"}
              </Badge>
              {!profile?.responder_details?.is_verified && (
                <Badge variant="outline" className="text-yellow-600">
                  PENDING VERIFICATION
                </Badge>
              )}
              {currentLocation && (
                <Badge variant="outline" className="text-green-600">
                  <Navigation className="h-3 w-3 mr-1" />
                  Location Active
                </Badge>
              )}
              {locationError && (
                <Badge variant="outline" className="text-red-600">
                  Location Error
                </Badge>
              )}

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProfile(true)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <ResponderProfile
                  isOpen={showProfile}
                  onClose={() => setShowProfile(false)}
                  onProfileUpdate={() => {
                    // agar data fetch karna hai to yahan kar lena
                    setShowProfile(false);
                  }}
                />
                <Button variant="outline" onClick={signOut}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!profile?.responder_details?.is_verified && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Account Pending Verification</h3>
                  <p className="text-yellow-700">
                    Your responder account is currently being verified. You will receive access to emergency alerts once your credentials are approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
            <TabsTrigger value="map">Area Map</TabsTrigger>
            <TabsTrigger value="history">Response History</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-6">
            {/* Stats Cards - Using the new component */}
            <ResponderStatsCards />

            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Emergency Alerts</span>
                  <Badge variant="outline">
                    {visibleAlerts.length} Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!profile?.responder_details?.is_verified && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800">
                      Your account is pending verification. You will see emergency alerts once verified.
                    </p>
                  </div>
                )}

                {profile?.responder_details?.is_verified && !onDuty && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800">
                      You are currently off duty. Turn on duty status to receive emergency alerts.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {visibleAlerts.map((alert) => {
                    const distance = getDistanceToAlert(alert);

                    return (
                      <div key={alert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getAlertIcon(alert.type)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge className={getAlertTypeColor(alert.type)}>
                                  {alert.type.toUpperCase()}
                                </Badge>
                                <Badge className={getStatusColor(alert.status)}>
                                  {alert.status.toUpperCase()}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                  {new Date(alert.created_at).toLocaleTimeString()}
                                </span>
                                {distance && (
                                  <Badge variant="outline" className="text-blue-600">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {distance}
                                  </Badge>
                                )}
                              </div>
                              <p className="font-semibold">{alert.location_description}</p>
                              <p className="text-sm text-gray-600">
                                Contact: {alert.profiles?.phone || 'N/A'}
                              </p>
                              {alert.description && (
                                <p className="text-sm text-gray-700 mt-1">{alert.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2">
                            {alert.profiles?.phone && (
                              <Button
                                size="sm"
                                onClick={() => contactUser(alert.profiles.phone)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                Contact
                              </Button>
                            )}

                            {alert.status === "active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => acknowledgeAlert(alert.id)}
                              >
                                Acknowledge
                              </Button>
                            )}

                            {alert.status === "acknowledged" && (
                              <Button
                                size="sm"
                                onClick={() => respondToAlert(alert.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Respond
                              </Button>
                            )}

                            {alert.status === "responding" && (
                              <Button
                                size="sm"
                                onClick={() => completeAlert(alert.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Complete
                              </Button>
                            )}

                            <NavigationButton
                              userLat={currentLocation?.lat}
                              userLng={currentLocation?.lng}
                              destLat={alert.location_lat}
                              destLng={alert.location_lng}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {visibleAlerts.length === 0 && profile?.responder_details?.is_verified && onDuty && (
                    <div className="text-center py-8 text-gray-500">
                      No active emergency alerts in your area
                    </div>
                  )}
                </div>
              </CardContent>
            </Card> 
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Area Coverage Map</CardTitle>
              </CardHeader>
              <CardContent>
              <div style={{ height: "100vh", width: "86vw" }}>
  <EmergencyMap userLocation={null} />
</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Response History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {responderHistory.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold capitalize">{alert.type} Emergency</p>
                          <p className="text-sm text-gray-600">{alert.location_description}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(alert.created_at).toLocaleDateString()} at {new Date(alert.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {responderHistory.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No response history yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>


        
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <AnonymousReportsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResponderDashboard;
