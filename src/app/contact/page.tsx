
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, User, MessageSquare } from 'lucide-react';
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');

  const recipientEmail = "deepwithdarby@gmail.com"; 

  const subject = `Message from ${name}`;
  const body = `Name: ${name}%0D%0AMobile Number: ${mobileNumber}%0D%0AMessage: ${message}`;
  const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
            <CardDescription>We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Name
              </Label>
              <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile" className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Mobile Number (Optional)
              </Label>
              <Input id="mobile" type="tel" placeholder="Enter your mobile number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Label>
              <Textarea id="message" placeholder="Enter your message" className="min-h-[120px]" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={mailtoLink}>Send Message</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
