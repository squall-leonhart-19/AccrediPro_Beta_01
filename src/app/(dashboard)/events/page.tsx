import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Video,
  Users,
  Play,
  Bell,
  MapPin,
  CalendarDays,
} from "lucide-react";

// Sample events data - in production, this would come from database
const upcomingEvents = [
  {
    id: "1",
    title: "Live Q&A: Functional Medicine Foundations",
    description: "Join our weekly Q&A session to discuss course content and get your questions answered.",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: "2:00 PM EST",
    duration: "60 min",
    type: "Q&A",
    host: "Dr. Sarah",
    isLive: false,
    spotsLeft: 25,
  },
  {
    id: "2",
    title: "Workshop: Client Assessment Techniques",
    description: "Hands-on workshop covering practical assessment techniques for functional medicine coaching.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: "11:00 AM EST",
    duration: "90 min",
    type: "Workshop",
    host: "Coach Team",
    isLive: false,
    spotsLeft: 15,
  },
];

const pastEvents = [
  {
    id: "3",
    title: "Introduction to Gut Health Protocols",
    description: "Deep dive into gut health assessment and protocol development.",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: "75 min",
    type: "Webinar",
    hasReplay: true,
  },
  {
    id: "4",
    title: "Business Building for Health Coaches",
    description: "Essential strategies for building and growing your coaching practice.",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    duration: "60 min",
    type: "Workshop",
    hasReplay: true,
  },
];

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        </div>
        <CardContent className="p-8 relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Calendar className="w-7 h-7 text-gold-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Events</h1>
              <p className="text-burgundy-200">Live sessions, workshops & Q&A calls</p>
            </div>
          </div>
          <p className="text-burgundy-100 max-w-2xl">
            Join live sessions, workshops, Q&A calls, and special trainings. Access replays anytime
            and stay updated on upcoming experiences.
          </p>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-burgundy-100 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-burgundy-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <p className="text-sm text-gray-500">Don&apos;t miss these live sessions</p>
          </div>
        </div>

        {upcomingEvents.length === 0 ? (
          <Card className="card-premium">
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
              <p className="text-gray-500">Check back soon for new live sessions and workshops.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="card-premium hover:border-burgundy-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 text-center flex-shrink-0">
                      <div className="text-2xl font-bold text-burgundy-600">
                        {event.date.getDate()}
                      </div>
                      <div className="text-sm text-gray-500 uppercase">
                        {event.date.toLocaleDateString("en-US", { month: "short" })}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-burgundy-100 text-burgundy-700">{event.type}</Badge>
                        {event.isLive && (
                          <Badge className="bg-red-100 text-red-700 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-red-500 mr-1" />
                            LIVE NOW
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          {event.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.spotsLeft} spots left
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-burgundy-600 hover:bg-burgundy-700">
                          Register Now
                        </Button>
                        <Button variant="outline" size="icon">
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Events / Replays */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Play className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Event Replays</h2>
            <p className="text-sm text-gray-500">Watch recordings of past sessions</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {pastEvents.map((event) => (
            <Card key={event.id} className="card-premium">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {event.type}
                    </Badge>
                    <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{event.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(event.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.duration}
                      </span>
                    </div>
                  </div>
                  {event.hasReplay && (
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Watch
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Event Categories */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="card-premium">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center mx-auto mb-3">
              <Video className="w-6 h-6 text-burgundy-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Live Webinars</h4>
            <p className="text-sm text-gray-500">In-depth topic sessions</p>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-gold-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Q&A Sessions</h4>
            <p className="text-sm text-gray-500">Ask your questions live</p>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Workshops</h4>
            <p className="text-sm text-gray-500">Hands-on learning</p>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Play className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Replays</h4>
            <p className="text-sm text-gray-500">Watch anytime</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
