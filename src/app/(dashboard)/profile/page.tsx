"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tradition, TonePreference } from "@/types/index";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  age: z
    .number()
    .int()
    .min(13, "Must be at least 13 years old")
    .max(120, "Please enter a valid age")
    .optional()
    .or(z.literal("")),
  culturalBackground: z.string().max(200).optional(),
  preferredTradition: z.enum(["hindu", "buddhist", "greek", "universal"]),
  tonePreference: z.enum(["casual", "devotional", "philosophical", "practical"]),
  notificationEnabled: z.boolean(),
  dailyWisdom: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserData {
  user: {
    id: string;
    email: string;
    name: string | null;
    age: number | null;
    culturalBackground: string | null;
    preferredTradition: Tradition;
  };
  preferences: {
    userId: string;
    tonePreference: TonePreference;
    notificationEnabled: boolean;
    dailyWisdom: boolean;
    language: string;
  } | null;
}

const TRADITIONS: { value: Tradition; label: string }[] = [
  { value: "hindu", label: "Hindu" },
  { value: "buddhist", label: "Buddhist" },
  { value: "greek", label: "Greek" },
  { value: "universal", label: "Universal" },
];

const TONE_PREFERENCES: { value: TonePreference; label: string }[] = [
  { value: "casual", label: "Casual - Relaxed and conversational" },
  { value: "devotional", label: "Devotional - Spiritual and reverent" },
  { value: "philosophical", label: "Philosophical - Thoughtful and analytical" },
  { value: "practical", label: "Practical - Actionable and grounded" },
];

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      notificationEnabled: true,
      dailyWisdom: true,
    },
  });

  const preferredTradition = watch("preferredTradition");
  const tonePreference = watch("tonePreference");
  const notificationEnabled = watch("notificationEnabled");
  const dailyWisdom = watch("dailyWisdom");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/preferences");
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data: { success: boolean; data: UserData } = await response.json();

        if (data.success && data.data) {
          const { user, preferences } = data.data;
          setValue("name", user.name || "");
          setValue("age", user.age || "");
          setValue("culturalBackground", user.culturalBackground || "");
          setValue("preferredTradition", user.preferredTradition);
          if (preferences) {
            setValue("tonePreference", preferences.tonePreference);
            setValue("notificationEnabled", preferences.notificationEnabled);
            setValue("dailyWisdom", preferences.dailyWisdom);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          age: data.age ? parseInt(data.age as any) : null,
          culturalBackground: data.culturalBackground,
          preferredTradition: data.preferredTradition,
          tonePreference: data.tonePreference,
          notificationEnabled: data.notificationEnabled,
          dailyWisdom: data.dailyWisdom,
        }),
      });

      if (!response.ok) throw new Error("Failed to save preferences");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-display text-saffron mb-2">Profile</h1>
        <p className="text-gray-600">Manage your personal information and preferences</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Profile updated successfully
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="bg-parchment border-saffron/20 p-8 mb-8">
          <h2 className="text-2xl font-display text-saffron mb-6">Personal Information</h2>

          {/* Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              id="name"
              placeholder="Your name"
              {...register("name")}
              className="w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Age */}
          <div className="mb-6">
            <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
              Age
            </label>
            <Input
              id="age"
              type="number"
              placeholder="Your age"
              {...register("age", { valueAsNumber: true })}
              className="w-full"
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
            )}
          </div>

          {/* Cultural Background */}
          <div className="mb-6">
            <label
              htmlFor="culturalBackground"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Cultural Background
            </label>
            <Input
              id="culturalBackground"
              placeholder="e.g., Indian, Thai, Greek, etc."
              {...register("culturalBackground")}
              className="w-full"
            />
            {errors.culturalBackground && (
              <p className="text-red-500 text-sm mt-1">{errors.culturalBackground.message}</p>
            )}
          </div>
        </Card>

        <Card className="bg-parchment border-saffron/20 p-8 mb-8">
          <h2 className="text-2xl font-display text-saffron mb-6">Preferences</h2>

          {/* Preferred Tradition */}
          <div className="mb-6">
            <label htmlFor="tradition" className="block text-sm font-semibold text-gray-700 mb-2">
              Preferred Tradition
            </label>
            <Select value={preferredTradition} onValueChange={(value: any) => setValue("preferredTradition", value)}>
              <SelectTrigger id="tradition" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRADITIONS.map((trad) => (
                  <SelectItem key={trad.value} value={trad.value}>
                    {trad.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.preferredTradition && (
              <p className="text-red-500 text-sm mt-1">{errors.preferredTradition.message}</p>
            )}
          </div>

          {/* Tone Preference */}
          <div className="mb-6">
            <label htmlFor="tone" className="block text-sm font-semibold text-gray-700 mb-2">
              Preferred Tone
            </label>
            <Select value={tonePreference} onValueChange={(value: any) => setValue("tonePreference", value)}>
              <SelectTrigger id="tone" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONE_PREFERENCES.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tonePreference && (
              <p className="text-red-500 text-sm mt-1">{errors.tonePreference.message}</p>
            )}
          </div>

          {/* Notification Preferences */}
          <div className="mb-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationEnabled}
                onChange={(e) => setValue("notificationEnabled", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Enable email notifications
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dailyWisdom}
                onChange={(e) => setValue("dailyWisdom", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Receive daily wisdom email
              </span>
            </label>
          </div>
        </Card>

        {/* Save Button */}
        <Button
          type="submit"
          disabled={isSaving}
          className="w-full bg-saffron hover:bg-saffron/90 text-white text-lg py-6"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
