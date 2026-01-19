'use client';

import { useState } from 'react';

import { Mail, MessageCircle, Send, ShoppingBag, Sparkles, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { GINI3D_NPUB } from '@/lib/types';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, show success message
    // In future, this could send a Nostr DM
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (submitted) {
    return (
      <div className="container mx-auto min-h-[60vh] px-4 py-12">
        <Card className="card-cute mx-auto max-w-lg text-center">
          <CardContent className="pt-8">
            <div className="mb-6 text-6xl">🎉</div>
            <h2 className="font-fun gradient-text mb-4 text-3xl font-bold">Message Sent!</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Thanks for reaching out! Nini & Gabby will get back to you super soon! 💖
            </p>
            <div className="mb-6 flex justify-center gap-2 text-2xl">
              <span className="float">🐹</span>
              <span className="sparkle">✨</span>
              <span className="float" style={{ animationDelay: '0.5s' }}>
                🐹
              </span>
            </div>
            <Button
              onClick={() => setSubmitted(false)}
              className="btn-fun bg-gini-heart hover:bg-gini-500"
            >
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Fun Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Star className="h-6 w-6 animate-pulse text-yellow-400" />
          <span className="text-4xl">💌</span>
          <Star className="h-6 w-6 animate-pulse text-yellow-400" />
        </div>
        <h1 className="font-fun gradient-text mb-4 text-4xl font-bold md:text-5xl">Say Hello!</h1>
        <p className="text-muted-foreground mx-auto max-w-xl text-lg">
          Got questions about 3D printing? Want a custom design? Or just want to say hi? We&apos;d
          love to hear from you! 🌟
        </p>
      </div>

      {/* Become a Seller CTA */}
      <div className="mx-auto mb-12 max-w-3xl">
        <Card className="bg-rainbow-gradient border-none p-1">
          <div className="rounded-lg bg-white p-6 md:p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="flex-shrink-0 text-6xl">🏪</div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-fun mb-2 text-2xl font-bold">Want to Sell on Gini3D?</h2>
                <p className="text-muted-foreground mb-4">
                  Are you a 3D printing maker on Nostr? We&apos;re always looking for awesome
                  sellers who specialize in 3D printed products! Contact us to become a featured
                  seller.
                </p>
                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                  <span className="bg-gini-100 text-gini-600 rounded-full px-3 py-1 text-sm">
                    ✓ 3D Printing Focus
                  </span>
                  <span className="bg-gini-100 text-gini-600 rounded-full px-3 py-1 text-sm">
                    ✓ Nostr Integration
                  </span>
                  <span className="bg-gini-100 text-gini-600 rounded-full px-3 py-1 text-sm">
                    ✓ Bitcoin Payments
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button
                  className="btn-fun bg-gini-heart hover:bg-gini-500"
                  onClick={() => {
                    const subjectInput = document.getElementById('subject') as HTMLInputElement;
                    const messageInput = document.getElementById('message') as HTMLTextAreaElement;
                    if (subjectInput) subjectInput.value = 'I want to sell on Gini3D!';
                    if (messageInput) {
                      messageInput.value =
                        "Hi Nini & Gabby!\n\nI'm a 3D printing maker and I'd love to sell my products on Gini3D.\n\nHere's a bit about me and what I make:\n\n";
                      messageInput.focus();
                    }
                    setFormData((prev) => ({
                      ...prev,
                      subject: 'I want to sell on Gini3D!',
                      message:
                        "Hi Nini & Gabby!\n\nI'm a 3D printing maker and I'd love to sell my products on Gini3D.\n\nHere's a bit about me and what I make:\n\n",
                    }));
                    document.getElementById('name')?.focus();
                  }}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Apply to Sell
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        {/* Contact Form */}
        <Card className="card-cute hover-lift">
          <CardHeader>
            <CardTitle className="font-fun flex items-center gap-2 text-2xl">
              <MessageCircle className="text-gini-purple h-6 w-6" />
              Send Us a Message
            </CardTitle>
            <CardDescription>Fill out the form and we&apos;ll get back to you!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-fun">
                  Your Name 🐹
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="What should we call you?"
                  required
                  className="border-gini-200 focus:border-gini-heart"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-fun">
                  Email Address 📧
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="border-gini-200 focus:border-gini-heart"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="font-fun">
                  Subject ✨
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                  className="border-gini-200 focus:border-gini-heart"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-fun">
                  Your Message 💬
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind!"
                  rows={5}
                  required
                  className="border-gini-200 focus:border-gini-heart"
                />
              </div>

              <Button type="submit" className="btn-fun bg-gini-heart hover:bg-gini-500 w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="space-y-6">
          {/* Nostr Contact */}
          <Card className="bg-gini-gradient hover-lift border-none">
            <CardHeader>
              <CardTitle className="font-fun flex items-center gap-2 text-xl">
                <span className="text-2xl">⚡</span>
                Message Us on Nostr
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Have a Nostr account? Send us a direct message!
              </p>
              <div className="rounded-lg bg-white/50 p-3">
                <p className="mb-1 text-sm font-medium">Our Nostr npub:</p>
                <code className="text-gini-purple text-xs break-all">{GINI3D_NPUB}</code>
              </div>
              <Button
                variant="outline"
                className="border-gini-purple text-gini-purple hover:bg-gini-100 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(GINI3D_NPUB);
                }}
              >
                Copy npub 📋
              </Button>
            </CardContent>
          </Card>

          {/* Fun Facts */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="font-fun flex items-center gap-2 text-xl">
                <span className="text-2xl">🌈</span>
                About Gini3D
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👧</span>
                <div>
                  <p className="font-fun font-bold">Run by Nini & Gabby</p>
                  <p className="text-muted-foreground text-sm">Two 10-year-old entrepreneurs!</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🐹</span>
                <div>
                  <p className="font-fun font-bold">Guinea Pig Lovers</p>
                  <p className="text-muted-foreground text-sm">
                    Our guinea pigs inspire our designs!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🖨️</span>
                <div>
                  <p className="font-fun font-bold">Custom 3D Prints</p>
                  <p className="text-muted-foreground text-sm">
                    We can make almost anything you dream up!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-fun font-bold">Bitcoin Accepted</p>
                  <p className="text-muted-foreground text-sm">Pay with Lightning for fast zaps!</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Option */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="font-fun flex items-center gap-2 text-xl">
                <Mail className="text-gini-orange h-5 w-5" />
                Email Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">Prefer email? No problem!</p>
              <a
                href="mailto:hello@gini3d.com"
                className="font-fun text-gini-purple hover:underline"
              >
                hello@gini3d.com
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="pointer-events-none fixed top-1/4 -right-20 text-6xl opacity-20">🎀</div>
      <div className="pointer-events-none fixed bottom-1/4 -left-10 text-6xl opacity-20">💖</div>
    </div>
  );
}
