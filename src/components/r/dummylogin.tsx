'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Mail, Lock } from 'lucide-react';

export default function DummyLogin() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const dummyData = {
    user: {
      email: 'viyam69234@acedby.com',
      password: 'viyam69234@acedby.com'
    },
    hospital: {
      email: 'wamah55443@linacit.com',
      password: 'wamah55443@linacit.com'
    },
    responder: {
      email: 'nadigax757@endelite.com',
      password: 'nadigax757@endelite.com'
    }
  };

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dummy Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dummy Login Details ,for testing purpose only. </DialogTitle>
         <h1 className="text-sm text-gray-500">
           both email and password are same
</h1>
        </DialogHeader>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="hospital">Hospital</TabsTrigger>
            <TabsTrigger value="responder">Responder</TabsTrigger>
          </TabsList>

          {Object.entries(dummyData).map(([key, creds]) => (
            <TabsContent key={key} value={key} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={creds.email} />
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleCopy(creds.email, `${key}-email`)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedField === `${key}-email` && (
                  <p className="text-xs text-green-600">Email copied!</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Password
                </label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={creds.password} type="text" />
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleCopy(creds.password, `${key}-password`)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedField === `${key}-password` && (
                  <p className="text-xs text-green-600">Password copied!</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
