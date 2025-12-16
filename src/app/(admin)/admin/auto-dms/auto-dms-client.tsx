"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Zap,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  GraduationCap,
  Mic,
  Calendar,
  Users,
  BookOpen,
  Edit,
  Eye,
  Tag,
  Activity,
  RefreshCw,
  AlertTriangle,
  Mail,
  Send,
  Volume2,
  ChevronRight,
  Settings,
  User,
  Video,
  Gift,
  Sparkles,
  Award,
  Heart,
  Target,
} from "lucide-react";

// ============================================
// MINI DIPLOMA MODULE DMs (Modules 1-3)
// ============================================
const MINI_DIPLOMA_MODULE_MESSAGES: Record<number, { text: string; voiceScript: string | null; hasVoice: boolean; tag: string }> = {
  1: {
    text: `{{firstName}}! 🎉\n\nYou just completed Module 1 of your Mini Diploma - that's such a great start!\n\nYou're now understanding the foundations of Functional Medicine, and trust me, this knowledge is going to serve you SO well.\n\nI left you a quick voice note to celebrate! Keep going, you're doing amazing!\n\n- Sarah ✨`,
    voiceScript: `{{firstName}}! You just completed Module 1 of your Mini Diploma!\n\nI'm so proud of you for taking action. You're now understanding the foundations of functional medicine, and this is exactly where the magic starts.\n\nKeep that momentum going! You've got three more modules to go, and I know you're going to crush them.\n\nTalk soon!`,
    hasVoice: true,
    tag: "mini_diploma_module_1_complete",
  },
  2: {
    text: `{{firstName}}!! 💪\n\nModule 2 DONE! You're officially halfway through your Mini Diploma!\n\nI have to say... most people who download free courses never even open them. But YOU? You're showing up. You're doing the work. That tells me everything I need to know about you.\n\nListen to my voice message when you get a chance!\n\n- Sarah 🌟`,
    voiceScript: `{{firstName}}! Module 2 complete! You are officially halfway through your Mini Diploma!\n\nCan I tell you something? Most people who download free courses... they never even open them. But you? You're different. You're showing up. You're putting in the work.\n\nThat tells me something about you. You're not just curious... you're serious about this.\n\nTwo more modules to go. You've got this!`,
    hasVoice: true,
    tag: "mini_diploma_module_2_complete",
  },
  3: {
    text: `{{firstName}}!!! 🔥\n\nOH WOW - Module 3 is DONE! You're SO close now!\n\nJust the Final Exam left, and then you'll have completed your entire Mini Diploma. Can you believe how far you've come?\n\nI'm genuinely excited for you. This is real progress, real knowledge, real transformation happening.\n\nI left you a voice message - give it a listen!\n\nAlmost there! 🎓\n\n- Sarah`,
    voiceScript: `{{firstName}}! Module 3 is done! Oh my gosh, you are SO close now!\n\nJust the Final Exam left, and then... you'll have completed your entire Mini Diploma. Can you believe how far you've come?\n\nI'm genuinely excited for you right now. This is real progress. Real knowledge. Real transformation happening.\n\nGo take that Final Exam. I believe in you. And when you pass... we'll celebrate together.\n\nYou've got this!`,
    hasVoice: true,
    tag: "mini_diploma_module_3_complete",
  },
};

// ============================================
// MAIN CERTIFICATION MODULE DMs (Modules 0-20)
// ============================================
const MODULE_NAMES: Record<number, string> = {
  0: "Welcome & Orientation",
  1: "Functional Medicine Foundations",
  2: "Health Coaching Mastery",
  3: "Clinical Assessment",
  4: "Ethics & Scope",
  5: "Functional Nutrition",
  6: "Gut Health & Microbiome",
  7: "Stress, Adrenals & Nervous System",
  8: "Blood Sugar & Insulin",
  9: "Women's Hormone Health",
  10: "Perimenopause & Menopause",
  11: "Thyroid Health",
  12: "Metabolic Health & Weight",
  13: "Autoimmunity & Inflammation",
  14: "Mental Health & Brain Function",
  15: "Cardiometabolic Health",
  16: "Energy & Mitochondrial Health",
  17: "Detox & Environmental Health",
  18: "Immune Health",
  19: "Protocol Building & Program Design",
  20: "Building Your Coaching Practice",
};

const MODULE_COMPLETION_MESSAGES: Record<number, { text: string; voiceScript: string | null; hasVoice: boolean; tag: string }> = {
  0: { text: `{{firstName}}!!\n\nYou just completed Module 0 - Welcome & Orientation!\n\nI'm SO proud of you for taking this first step. You've officially started your functional medicine journey, and that's huge.\n\nI left you a quick voice message to celebrate. Can't wait to see you crush the next module!\n\n- Sarah`, voiceScript: `{{firstName}}! You just completed Module 0, Welcome and Orientation! I'm SO proud of you for taking this first step. You've officially started your functional medicine journey, and that's huge. Keep that momentum going, I know you've got this!`, hasVoice: true, tag: "module_0_complete" },
  1: { text: `{{firstName}}!\n\nModule 1 DONE! Functional Medicine Foundations - you now understand the core principles that set this approach apart.\n\nYou're building such a strong foundation. This knowledge is going to serve your future clients SO well.\n\nI left you a voice note!\n\n- Sarah`, voiceScript: `Wow {{firstName}}! You just crushed Module 1, Functional Medicine Foundations! You now understand the core principles that make functional medicine so powerful. This foundation is everything. You're on fire!`, hasVoice: true, tag: "module_1_complete" },
  2: { text: `{{firstName}}!!!\n\nYou finished Module 2 - Health Coaching Mastery!\n\nThis is such an important one. The way you communicate with clients can make or break their transformation. And now you have those skills!\n\nKeep going, you're doing amazing!\n\n- Sarah`, voiceScript: `{{firstName}}! Module 2 complete! Health Coaching Mastery. This is such a game-changer...`, hasVoice: true, tag: "module_2_complete" },
  3: { text: `{{firstName}}, Module 3 is DONE!\n\nClinical Assessment - you now know how to properly evaluate clients and understand what's really going on in their bodies.\n\n- Sarah`, voiceScript: `{{firstName}}! Module 3, Clinical Assessment, complete!`, hasVoice: true, tag: "module_3_complete" },
  4: { text: `Amazing work, {{firstName}}!\n\nYou've completed Module 4 - Ethics & Scope!\n\nI know ethics might not be the most exciting topic... but it's SO important.\n\n- Sarah`, voiceScript: `{{firstName}}, Module 4 done! Ethics and Scope.`, hasVoice: true, tag: "module_4_complete" },
  5: { text: `YES {{firstName}}!!\n\nModule 5 - Functional Nutrition is COMPLETE!\n\nThis is one of my favorite modules. You're halfway through!\n\n- Sarah`, voiceScript: `YES {{firstName}}! Module 5 complete!`, hasVoice: true, tag: "module_5_complete" },
  6: { text: `{{firstName}}!!\n\nGut Health & Microbiome - DONE!\n\nThis is where so many health issues begin AND where healing happens.\n\n- Sarah`, voiceScript: `{{firstName}}! Module 6 complete!`, hasVoice: true, tag: "module_6_complete" },
  7: { text: `Module 7 CRUSHED, {{firstName}}!\n\nStress, Adrenals & Nervous System - you now understand the stress connection.\n\n- Sarah`, voiceScript: `Module 7 crushed {{firstName}}!`, hasVoice: true, tag: "module_7_complete" },
  8: { text: `{{firstName}}, you're on FIRE!\n\nModule 8 - Blood Sugar & Insulin complete!\n\n- Sarah`, voiceScript: `{{firstName}}, you're on fire!`, hasVoice: true, tag: "module_8_complete" },
  9: { text: `WOW {{firstName}}!!\n\nModule 9 - Women's Hormone Health is DONE!\n\n- Sarah`, voiceScript: `Wow {{firstName}}! Module 9 complete!`, hasVoice: true, tag: "module_9_complete" },
  10: { text: `{{firstName}}!! Double digits!\n\nModule 10 - Perimenopause & Menopause complete!\n\n- Sarah`, voiceScript: `{{firstName}}! Double digits!`, hasVoice: true, tag: "module_10_complete" },
  11: { text: `THYROID MASTER, {{firstName}}!\n\nModule 11 - Thyroid Health is complete!\n\n- Sarah`, voiceScript: `Thyroid master {{firstName}}!`, hasVoice: true, tag: "module_11_complete" },
  12: { text: `{{firstName}}!!\n\nModule 12 - Metabolic Health & Weight is DONE!\n\n- Sarah`, voiceScript: `{{firstName}}! Module 12 complete!`, hasVoice: true, tag: "module_12_complete" },
  13: { text: `Amazing {{firstName}}!\n\nModule 13 - Autoimmunity & Inflammation complete!\n\n- Sarah`, voiceScript: `Amazing {{firstName}}!`, hasVoice: true, tag: "module_13_complete" },
  14: { text: `{{firstName}}, BRAIN HEALTH EXPERT!\n\nModule 14 - Mental Health & Brain Function is DONE!\n\n- Sarah`, voiceScript: `{{firstName}}, brain health expert!`, hasVoice: true, tag: "module_14_complete" },
  15: { text: `HEART HEALTH HERO {{firstName}}!\n\nModule 15 - Cardiometabolic Health complete!\n\n- Sarah`, voiceScript: `Heart health hero {{firstName}}!`, hasVoice: true, tag: "module_15_complete" },
  16: { text: `{{firstName}}!!\n\nModule 16 - Energy & Mitochondrial Health is DONE!\n\n- Sarah`, voiceScript: `{{firstName}}! Module 16 complete!`, hasVoice: true, tag: "module_16_complete" },
  17: { text: `DETOX SPECIALIST {{firstName}}!\n\nModule 17 - Detox & Environmental Health is complete!\n\n- Sarah`, voiceScript: `Detox specialist {{firstName}}!`, hasVoice: true, tag: "module_17_complete" },
  18: { text: `{{firstName}}!!!\n\nModule 18 - Immune Health is DONE!\n\n- Sarah`, voiceScript: `{{firstName}}! Module 18 complete!`, hasVoice: true, tag: "module_18_complete" },
  19: { text: `PROTOCOL BUILDER {{firstName}}!!\n\nModule 19 - Protocol Building & Program Design is COMPLETE!\n\nONE MORE MODULE!\n\n- Sarah`, voiceScript: `Protocol builder {{firstName}}!`, hasVoice: true, tag: "module_19_complete" },
  20: { text: `{{firstName}}!!!\n\nOH MY GOSH!!! Module 20 - Building Your Coaching Practice is COMPLETE!!!\n\nYou did it. You actually DID it. You've completed the ENTIRE certification!\n\nWelcome to the family, certified coach!\n\n- Sarah`, voiceScript: `Oh my gosh {{firstName}}! You did it!`, hasVoice: true, tag: "certification_complete" },
};

// ============================================
// EVENT-BASED TRIGGERS
// ============================================
const EVENT_TRIGGERS = {
  first_login: {
    label: "First Login Welcome",
    description: "Sent immediately when user logs in for the first time",
    icon: "heart",
    hasVoice: true,
    tag: "welcome_sent",
    category: "onboarding",
    text: `{{firstName}}! Welcome to the family!

I'm SO excited you're here. I'm Sarah, your coach, and I'll be with you every step of the way.

I left you a quick voice message - give it a listen when you get a chance!

If you have ANY questions, just reply to this message. I'm here for you.

- Sarah ✨`,
    voiceScript: `{{firstName}}! Welcome to the family! I'm so excited you're here. I'm Sarah, your coach, and I'll be with you every step of the way.

Feel free to reach out anytime - I'm here to support you on your functional medicine journey!`,
  },
  mini_diploma_complete: {
    label: "Mini Diploma Complete",
    description: "Celebration when user completes the mini diploma final exam",
    icon: "award",
    hasVoice: true,
    tag: "mini_diploma_complete",
    category: "achievement",
    text: `{{firstName}}!! You did it!

You finished your Mini Diploma and I am SO proud of you!

Seriously - do you know how many people download something and never even open it? But YOU showed up. You did the work.

I left you a voice message to celebrate. Give it a listen!

When you're ready to talk about the full certification, I'm here.

- Sarah`,
    voiceScript: `Oh my gosh, {{firstName}}! You did it! You finished your Mini Diploma!

I am SO proud of you right now. Seriously. Do you know how many people download a freebie and never even open it? But you, you showed up. You did the work. You completed it.

That tells me something about you. You're not just curious... you're committed.`,
  },
  training_video_complete: {
    label: "Training Video Complete",
    description: "Sent 5-10 min after user watches 70%+ of the graduate training video",
    icon: "video",
    hasVoice: true,
    tag: "training_video_dm_sent",
    category: "engagement",
    text: `{{firstName}}! 🎬

I just saw you finished watching the Graduate Training - that's AMAZING!

I put so much into that training because I wanted you to really SEE what's possible with functional medicine. The real transformations. The actual client results.

So now that you've seen it... what do you think? Can you picture yourself doing this?

I left you a voice message with some thoughts. Listen when you can!

If you have ANY questions about the certification, the investment, or whether this is right for you - just reply here. I'm always happy to chat.

- Sarah 💛`,
    voiceScript: `{{firstName}}! I just saw you finished watching the Graduate Training, and I had to send you a quick message.

That training... I put my heart into it. Because I wanted you to really see what's possible. Not just theory, but real transformations. Real client results. Real lives being changed.

So now that you've seen it... I have to ask... can you picture yourself doing this?`,
  },
  pricing_page_visit: {
    label: "Pricing Page Visit",
    description: "Follow-up when user visits the pricing/checkout page",
    icon: "target",
    hasVoice: false,
    tag: "pricing_interest",
    category: "sales",
    text: `Hey {{firstName}}!

I noticed you were checking out the certification program - exciting!

Any questions I can help answer? I'm here if you want to chat about pricing, what's included, or anything else.

No pressure at all. Just here to help!

- Sarah`,
    voiceScript: null,
  },
};

// ============================================
// NURTURE SEQUENCE DMs
// ============================================
const SEQUENCE_DM_CONTENT = {
  sequence_day_5: {
    label: "Day 5 - Check-in",
    description: "Gentle nudge about the Graduate Training",
    day: 5,
    hasVoice: true,
    tag: "nurture_day_5",
    text: `Hey {{firstName}}!

Just checking in - how's your Mini Diploma going?

I noticed you might not have watched the Graduate Training yet. It's a 45-minute session where I show you exactly what's possible with functional medicine.

No pressure at all, but I think you'd find it really valuable. Let me know if you have any questions!

- Sarah`,
    voiceScript: `Hey {{firstName}}! Just checking in, how's your Mini Diploma going?
I noticed you might not have watched the Graduate Training yet. It's a 45-minute session where I show you exactly what's possible with functional medicine.
No pressure at all, but I think you'd find it really valuable. Let me know if you have any questions!`,
  },
  sequence_day_10: {
    label: "Day 10 - Progress",
    description: "Celebrate their progress, mention certification",
    day: 10,
    hasVoice: false,
    tag: "nurture_day_10",
    text: `{{firstName}}!

I see you've been making progress - that's amazing!

I wanted to share something with you: The certification program is what really transformed my life. It's where everything clicked.

When you're ready to take the next step, I'm here. Just message me and we can talk about what that looks like for you.

Cheering you on!
- Sarah`,
    voiceScript: null,
  },
  sequence_day_20: {
    label: "Day 20 - Real Talk",
    description: "Investment conversation, payment plans",
    day: 20,
    hasVoice: true,
    tag: "nurture_day_20",
    text: `{{firstName}}, can we have a real talk?

I know $997 is a real investment. And if you're wondering if it's worth it, or if you can make it work... I want you to know I've been there.

I left you a voice message explaining my own journey with this. Give it a listen when you have a moment.

And if cost is the barrier, we do have payment plans. Let's figure this out together.

- Sarah`,
    voiceScript: `{{firstName}}, can we have a real talk?
I know 997 dollars is a real investment. And if you're wondering if it's worth it, or if you can make it work, I want you to know I've been there.
When I started, I didn't have the money either. But I made it work because I believed in myself. And you know what? It was the best decision I ever made.
If cost is the barrier, we do have payment plans. Let's figure this out together.`,
  },
  sequence_day_27: {
    label: "Day 27 - Urgency",
    description: "Enrollment closing reminder",
    day: 27,
    hasVoice: true,
    tag: "nurture_day_27",
    text: `{{firstName}}, heads up...

Enrollment is closing in just a few days. I didn't want you to miss it without at least checking in.

Is there anything holding you back? Any questions I can answer?

I left you a voice note too. I really believe this could change everything for you.

- Sarah`,
    voiceScript: `{{firstName}}, heads up! Enrollment is closing in just a few days. I didn't want you to miss it without at least checking in.
Is there anything holding you back? Any questions I can answer?
I really believe this could change everything for you. Message me back if you want to chat.`,
  },
  sequence_day_30: {
    label: "Day 30 - Final",
    description: "Last chance, door closing",
    day: 30,
    hasVoice: true,
    tag: "nurture_day_30",
    text: `{{firstName}}, this is it. The door closes tonight.

I'm not going to pressure you. You already know if this is right for you.

I just wanted to say: I believe in you. Whatever you decide.

Listen to my final voice message when you get a chance.

- Sarah`,
    voiceScript: `{{firstName}}, this is it. The door closes tonight.
I'm not going to pressure you. You already know if this is right for you.
I just wanted to say: I believe in you. Whatever you decide.
If you're ready to take the leap, I'll be here waiting for you on the other side.`,
  },
};

interface AutoDMsClientProps {
  stats: {
    scheduledMessages: number;
    sentVoiceDMs: number;
    totalSentDMs: number;
    recentActivity: Array<{
      id: string;
      content: string;
      createdAt: string;
      hasVoice: boolean;
      sender: { id: string; firstName: string | null; lastName: string | null; email: string; avatar: string | null } | null;
      receiver: { id: string; firstName: string | null; lastName: string | null; email: string } | null;
    }>;
    moduleCompletions: Array<{ moduleId: string; _count: { userId: number } }>;
    scheduledDetails: Array<{
      id: string;
      scheduledFor: string;
      status: string;
      receiver: { firstName: string | null; lastName: string | null; email: string } | null;
      textPreview: string;
    }>;
    failedMessages: Array<{
      id: string;
      scheduledFor: string;
      status: string;
      attempts: number;
      lastError: string | null;
      receiver: { firstName: string | null; lastName: string | null; email: string } | null;
    }>;
  };
  sarahCoach: { id: string; email: string; firstName: string | null; lastName: string | null } | null;
}

export function AutoDMsClient({ stats, sarahCoach }: AutoDMsClientProps) {
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<{ text: string; voiceScript: string | null; title: string } | null>(null);

  const openPreview = (title: string, text: string, voiceScript: string | null) => {
    setPreviewContent({ title, text, voiceScript });
    setPreviewDialogOpen(true);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "heart": return <Heart className="w-5 h-5" />;
      case "award": return <Award className="w-5 h-5" />;
      case "video": return <Video className="w-5 h-5" />;
      case "target": return <Target className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Zap className="w-8 h-8 text-gold-500" />
            Auto DMs
          </h1>
          <p className="text-gray-500 mt-1">
            Automated private messages from Coach Sarah with ElevenLabs voice
          </p>
        </div>
        <div className="flex items-center gap-2">
          {sarahCoach ? (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Mail className="w-3 h-3 mr-1" />
              From: {sarahCoach.email}
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-700 border-red-200">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Sarah account not found!
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.scheduledMessages}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-burgundy-50 to-white border-burgundy-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-burgundy-100 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-burgundy-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.sentVoiceDMs}</p>
                <p className="text-xs text-gray-500">Voice DMs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSentDMs}</p>
                <p className="text-xs text-gray-500">Total Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.failedMessages.length}</p>
                <p className="text-xs text-gray-500">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="overview" className="gap-2 py-2">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="mini-diploma" className="gap-2 py-2">
            <Gift className="w-4 h-4" />
            <span className="hidden sm:inline">Mini Diploma</span>
          </TabsTrigger>
          <TabsTrigger value="certification" className="gap-2 py-2">
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">Certification</span>
          </TabsTrigger>
          <TabsTrigger value="sequence" className="gap-2 py-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Sequence</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2 py-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
        </TabsList>

        {/* ============================================ */}
        {/* OVERVIEW TAB - All triggers at a glance */}
        {/* ============================================ */}
        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Event-Based Triggers */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-gold-500" />
                  Event-Based Triggers
                </CardTitle>
                <CardDescription>
                  DMs sent when specific user actions occur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(EVENT_TRIGGERS).map(([key, trigger]) => (
                  <div
                    key={key}
                    className="p-3 rounded-lg border border-gray-200 hover:border-burgundy-300 transition-colors bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          trigger.category === "onboarding" ? "bg-pink-100 text-pink-600" :
                          trigger.category === "achievement" ? "bg-gold-100 text-gold-600" :
                          trigger.category === "engagement" ? "bg-blue-100 text-blue-600" :
                          "bg-green-100 text-green-600"
                        }`}>
                          {getIcon(trigger.icon)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{trigger.label}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{trigger.description}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            {trigger.hasVoice && (
                              <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-[10px] px-1.5 py-0">
                                <Volume2 className="w-2.5 h-2.5 mr-0.5" />
                                Voice
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              <Tag className="w-2.5 h-2.5 mr-0.5" />
                              {trigger.tag}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openPreview(
                          trigger.label,
                          trigger.text,
                          trigger.voiceScript
                        )}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="space-y-6">
              {/* Mini Diploma Summary */}
              <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Gift className="w-5 h-5 text-purple-600" />
                    Mini Diploma DMs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-2 bg-white rounded-lg border">
                      <p className="text-lg font-bold text-gray-400">M0</p>
                      <p className="text-[10px] text-gray-400">Skip</p>
                    </div>
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="text-center p-2 bg-purple-100 rounded-lg border border-purple-200">
                        <p className="text-lg font-bold text-purple-700">M{num}</p>
                        <p className="text-[10px] text-purple-600 flex items-center justify-center">
                          <Volume2 className="w-2.5 h-2.5 mr-0.5" />
                          Voice
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    + Final Exam completion DM with voice
                  </p>
                </CardContent>
              </Card>

              {/* Certification Summary */}
              <Card className="bg-gradient-to-br from-gold-50 to-white border-gold-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GraduationCap className="w-5 h-5 text-gold-600" />
                    Main Certification DMs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 21 }, (_, i) => (
                      <div key={i} className="w-8 h-8 rounded-md bg-gold-100 border border-gold-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-gold-700">{i}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    21 modules • All with voice messages
                  </p>
                </CardContent>
              </Card>

              {/* Sequence Summary */}
              <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    30-Day Nurture Sequence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {[5, 10, 20, 27, 30].map((day, idx) => (
                      <div key={day} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          [5, 20, 27, 30].includes(day) ? "bg-blue-100 border-2 border-blue-300" : "bg-gray-100 border border-gray-200"
                        }`}>
                          <span className="text-sm font-bold text-gray-700">{day}</span>
                        </div>
                        {[5, 20, 27, 30].includes(day) && (
                          <Volume2 className="w-3 h-3 text-burgundy-500 mt-1" />
                        )}
                        {idx < 4 && (
                          <div className="w-6 h-0.5 bg-gray-200 absolute translate-x-8" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    5 touchpoints • 4 with voice
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* MINI DIPLOMA TAB */}
        {/* ============================================ */}
        <TabsContent value="mini-diploma">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-600" />
                Mini Diploma Module DMs
              </CardTitle>
              <CardDescription>
                Sarah sends personalized DMs when students complete mini diploma modules (free course)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Module 0 - Skipped */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                      <span className="font-bold text-gray-400 text-lg">0</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-500">Module 0: Welcome</h4>
                      <p className="text-sm text-gray-400 mt-1">Skipped - Only tags applied</p>
                      <Badge variant="outline" className="text-xs mt-2 bg-gray-100">
                        No DM
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Modules 1-3 with DMs */}
                {Object.entries(MINI_DIPLOMA_MODULE_MESSAGES).map(([moduleNum, content]) => (
                  <div
                    key={moduleNum}
                    className="p-4 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-sm">
                          <span className="font-bold text-white text-lg">{moduleNum}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Module {moduleNum}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs">
                              <Volume2 className="w-3 h-3 mr-1" />
                              Voice + Text
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              <Tag className="w-3 h-3 mr-1" />
                              {content.tag}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPreview(
                          `Mini Diploma Module ${moduleNum}`,
                          content.text,
                          content.voiceScript
                        )}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                      {content.text.substring(0, 100).replace(/\{\{firstName\}\}/g, "[Name]")}...
                    </p>
                  </div>
                ))}

                {/* Final Exam */}
                <div className="p-4 rounded-xl border-2 border-gold-300 bg-gradient-to-br from-gold-50 to-white md:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-md">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Final Exam Complete</h4>
                      <p className="text-sm text-gray-600">Celebration DM when user completes the entire mini diploma</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs">
                          <Volume2 className="w-3 h-3 mr-1" />
                          Voice + Text
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          <Tag className="w-3 h-3 mr-1" />
                          mini_diploma_complete
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* MAIN CERTIFICATION TAB */}
        {/* ============================================ */}
        <TabsContent value="certification">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-gold-600" />
                Main Certification Module DMs (21 Modules)
              </CardTitle>
              <CardDescription>
                Sarah sends personalized DMs with voice for each module in the $997 certification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[550px] pr-4">
                <div className="space-y-2">
                  {Object.entries(MODULE_COMPLETION_MESSAGES).map(([moduleNum, content]) => (
                    <div
                      key={moduleNum}
                      className={`p-3 rounded-lg border hover:shadow-sm transition-all bg-white ${
                        Number(moduleNum) === 20 ? "border-gold-300 bg-gradient-to-r from-gold-50 to-white" : "border-gray-200 hover:border-burgundy-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                            Number(moduleNum) === 20
                              ? "bg-gradient-to-br from-gold-500 to-gold-600"
                              : "bg-gradient-to-br from-burgundy-500 to-burgundy-700"
                          }`}>
                            <span className="font-bold text-white">{moduleNum}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {MODULE_NAMES[Number(moduleNum)] || "Unknown"}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-[10px] px-1.5 py-0">
                                <Volume2 className="w-2.5 h-2.5 mr-0.5" />
                                Voice
                              </Badge>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {content.tag}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openPreview(
                            `Module ${moduleNum}: ${MODULE_NAMES[Number(moduleNum)]}`,
                            content.text,
                            content.voiceScript
                          )}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* NURTURE SEQUENCE TAB */}
        {/* ============================================ */}
        <TabsContent value="sequence">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Sequence Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  30-Day Nurture Sequence DMs
                </CardTitle>
                <CardDescription>
                  Personalized check-ins at key points in the nurture flow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(SEQUENCE_DM_CONTENT).map(([key, content]) => (
                    <div
                      key={key}
                      className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="font-bold text-blue-700 text-lg">{content.day}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{content.label}</h4>
                            <p className="text-sm text-gray-500">{content.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {content.hasVoice && (
                                <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs">
                                  <Volume2 className="w-3 h-3 mr-1" />
                                  Voice
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {content.tag}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPreview(
                            content.label,
                            content.text,
                            content.voiceScript
                          )}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scheduled & Failed Messages */}
            <div className="space-y-6">
              {/* Pending */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-amber-500" />
                    Scheduled Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.scheduledDetails.length > 0 ? (
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {stats.scheduledDetails.map((msg) => (
                          <div key={msg.id} className="p-3 rounded-lg border border-amber-200 bg-amber-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {msg.receiver?.firstName} {msg.receiver?.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{msg.receiver?.email}</p>
                                <p className="text-xs text-amber-600 mt-1">
                                  {new Date(msg.scheduledFor).toLocaleString()}
                                </p>
                              </div>
                              <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">
                                {msg.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Clock className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No pending messages</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Failed */}
              {stats.failedMessages.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg text-red-700">
                      <AlertTriangle className="w-5 h-5" />
                      Failed Messages ({stats.failedMessages.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stats.failedMessages.map((msg) => (
                        <div key={msg.id} className="p-3 rounded-lg border border-red-200 bg-red-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {msg.receiver?.firstName} {msg.receiver?.lastName}
                              </p>
                              <p className="text-xs text-red-600">{msg.lastError}</p>
                            </div>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Retry
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* ACTIVITY LOG TAB */}
        {/* ============================================ */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                Recent Auto DM Activity
              </CardTitle>
              <CardDescription>
                All automated messages sent to students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {stats.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={activity.sender?.avatar || undefined} />
                            <AvatarFallback className="bg-burgundy-100 text-burgundy-700">
                              {activity.sender?.firstName?.[0] || "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-gray-900">
                                {activity.sender?.firstName || "Sarah"}
                              </span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                {activity.receiver?.firstName} {activity.receiver?.lastName}
                              </span>
                              {activity.hasVoice && (
                                <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs">
                                  <Mic className="w-3 h-3 mr-1" />
                                  Voice
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {activity.content}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(activity.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No auto DMs sent yet</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewContent?.title}</DialogTitle>
            <DialogDescription>Preview of the auto DM message</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Text Message</Label>
              <div className="mt-2 p-4 rounded-lg bg-gray-50 border whitespace-pre-line text-sm">
                {previewContent?.text.replace(/\{\{firstName\}\}/g, "[Student Name]")}
              </div>
            </div>
            {previewContent?.voiceScript && (
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Mic className="w-4 h-4 text-burgundy-600" />
                  Voice Script (ElevenLabs)
                </Label>
                <div className="mt-2 p-4 rounded-lg bg-burgundy-50 border border-burgundy-200 whitespace-pre-line text-sm italic text-burgundy-800">
                  "{previewContent.voiceScript.replace(/\{\{firstName\}\}/g, "[Student Name]")}"
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
