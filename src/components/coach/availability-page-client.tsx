"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2, Clock, Calendar } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMEZONES = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Phoenix",
    "Pacific/Honolulu",
];

interface DayAvailability {
    enabled: boolean;
    start: string;
    end: string;
}

interface AvailabilityPageClientProps {
    initialAvailability: any;
    initialTimezone: string;
    initialNote: string;
}

export function AvailabilityPageClient({
    initialAvailability,
    initialTimezone,
    initialNote,
}: AvailabilityPageClientProps) {
    const [saving, setSaving] = useState(false);
    const [timezone, setTimezone] = useState(initialTimezone);
    const [note, setNote] = useState(initialNote);
    const [availability, setAvailability] = useState<Record<string, DayAvailability>>(() => {
        const defaultAvailability: Record<string, DayAvailability> = {};
        DAYS.forEach((day) => {
            defaultAvailability[day] = {
                enabled: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day),
                start: "09:00",
                end: "17:00",
            };
        });
        return initialAvailability || defaultAvailability;
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/coach/availability", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    availability,
                    timezone,
                    availabilityNote: note,
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Availability saved!");
            } else {
                toast.error(data.error || "Failed to save");
            }
        } catch (error) {
            toast.error("Failed to save availability");
        } finally {
            setSaving(false);
        }
    };

    const updateDay = (day: string, updates: Partial<DayAvailability>) => {
        setAvailability((prev) => ({
            ...prev,
            [day]: { ...prev[day], ...updates },
        }));
    };

    return (
        <div className="p-6 max-w-3xl">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
                    <p className="text-gray-500">Set your coaching hours and availability</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-burgundy-600 hover:bg-burgundy-700">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>

            <div className="space-y-6">
                {/* Timezone */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-burgundy-500" />
                        Timezone
                    </h3>
                    <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="w-full max-w-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {TIMEZONES.map((tz) => (
                                <SelectItem key={tz} value={tz}>
                                    {tz.replace("_", " ")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Weekly Schedule */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-burgundy-500" />
                        Weekly Schedule
                    </h3>
                    <div className="space-y-4">
                        {DAYS.map((day) => (
                            <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-28">
                                    <p className="font-medium text-gray-900">{day}</p>
                                </div>
                                <Switch
                                    checked={availability[day]?.enabled ?? false}
                                    onCheckedChange={(checked) => updateDay(day, { enabled: checked })}
                                />
                                {availability[day]?.enabled && (
                                    <>
                                        <Input
                                            type="time"
                                            value={availability[day]?.start || "09:00"}
                                            onChange={(e) => updateDay(day, { start: e.target.value })}
                                            className="w-32"
                                        />
                                        <span className="text-gray-400">to</span>
                                        <Input
                                            type="time"
                                            value={availability[day]?.end || "17:00"}
                                            onChange={(e) => updateDay(day, { end: e.target.value })}
                                            className="w-32"
                                        />
                                    </>
                                )}
                                {!availability[day]?.enabled && (
                                    <span className="text-gray-400 text-sm">Unavailable</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Availability Note */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Availability Note</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Add a note that will be shown to clients when booking
                    </p>
                    <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="e.g., I'm currently booking 2-3 weeks out. For urgent consultations, please email me directly."
                        rows={3}
                    />
                </div>

                {/* Quick Tips */}
                <div className="bg-gradient-to-r from-burgundy-50 to-purple-50 rounded-2xl p-6 border border-burgundy-100">
                    <h4 className="font-bold text-burgundy-900 mb-2">💡 Pro Tips</h4>
                    <ul className="text-sm text-burgundy-700 space-y-1">
                        <li>• Block time for admin tasks and self-care</li>
                        <li>• Consider time zones of your typical clients</li>
                        <li>• Leave buffer time between sessions</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
