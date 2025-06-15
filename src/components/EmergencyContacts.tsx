"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", user.id);

    if (!error && data) {
      setContacts(data as Contact[]);
    }
  };

  const addContact = async (name: string, phone: string, email: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("emergency_contacts").insert([
      {
        name,
        phone,
        email,
        user_id: user.id,
      },
    ]);

    if (!error) {
      fetchContacts();
    } else {
      console.error("Error adding contact:", error.message);
    }
  };

  const removeContact = async (id: string) => {
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", id);
    if (!error) {
      fetchContacts();
    }
  };

  const handleAddContact = async () => {
    const { name, phone, email } = newContact;
    if (name && phone && email) {
      await addContact(name, phone, email);
      setNewContact({ name: "", phone: "", email: "" });
    }
  };

  const callContact = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const call911 = () => {
    window.open("tel:911");
  };

  return (
    <TabsContent value="contacts" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add Contact Form */}
            <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="contactName">Name</Label>
                <Input
                  id="contactName"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Contact name"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="example@email.com"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddContact} className="w-full">
                  Add Contact
                </Button>
              </div>
            </div>

            {/* Contact List */}
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-gray-600">{contact.phone}</p>
                    <p className="text-gray-600">{contact.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => callContact(contact.phone)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeContact(contact.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
