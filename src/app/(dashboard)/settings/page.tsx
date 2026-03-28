"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/user/export", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to export data");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `divya-gyan-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to export data");
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/user/account", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete account");

      // Redirect to home after deletion
      window.location.href = "/";
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-display text-saffron mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Account Section */}
      <Card className="bg-parchment border-saffron/20 p-8 mb-8">
        <h2 className="text-2xl font-display text-saffron mb-6">Account</h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Email Address</p>
            <p className="text-lg font-semibold text-gray-900">user@example.com</p>
          </div>

          <Separator className="my-6 bg-saffron/20" />

          <div>
            <p className="text-sm text-gray-600 mb-2">Account Status</p>
            <Badge className="bg-green-100 text-green-900">Active</Badge>
          </div>
        </div>
      </Card>

      {/* Subscription Section */}
      <Card className="bg-parchment border-saffron/20 p-8 mb-8">
        <h2 className="text-2xl font-display text-saffron mb-6">Subscription</h2>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Plan</p>
            <p className="text-lg font-semibold text-gray-900">Free Plan</p>
          </div>

          <Separator className="my-6 bg-saffron/20" />

          <div>
            <p className="text-sm text-gray-600 mb-3">Usage</p>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm">Consultations</p>
              <p className="text-sm font-semibold">2 / 5</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-saffron h-2 rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>
        </div>

        <Button className="w-full bg-saffron hover:bg-saffron/90 text-white">
          Upgrade to Premium
        </Button>
      </Card>

      {/* Privacy Section */}
      <Card className="bg-parchment border-saffron/20 p-8 mb-8">
        <h2 className="text-2xl font-display text-saffron mb-6">Privacy</h2>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start border-saffron/30 hover:bg-saffron/10"
            onClick={handleExportData}
          >
            Export My Data
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
            onClick={handleDeleteAccount}
          >
            {showDeleteConfirm ? "Confirm Delete Account" : "Delete Account"}
          </Button>

          {showDeleteConfirm && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm mb-3">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Legal Section */}
      <Card className="bg-parchment border-saffron/20 p-8">
        <h2 className="text-2xl font-display text-saffron mb-6">Legal</h2>

        <div className="flex flex-col gap-3">
          <a
            href="/legal/privacy-policy"
            className="text-saffron hover:text-saffron/80 font-semibold"
          >
            Privacy Policy
          </a>
          <a
            href="/legal/terms-of-service"
            className="text-saffron hover:text-saffron/80 font-semibold"
          >
            Terms of Service
          </a>
        </div>
      </Card>
    </div>
  );
}
