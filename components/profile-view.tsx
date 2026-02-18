"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  User,
  Phone,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  LogOut,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TrustedContact {
  name: string;
  phone: string;
  email?: string;
  relation?: string;
}

export function ProfileView() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Local state for editing
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
      });
      setTrustedContacts(user.trustedContacts || []);
    }
  }, [user]);

  const handleContactChange = (
    index: number,
    field: keyof TrustedContact,
    value: string,
  ) => {
    const newContacts = [...trustedContacts];
    // @ts-ignore
    newContacts[index][field] = value;
    setTrustedContacts(newContacts);
  };

  const addContact = () => {
    setTrustedContacts([
      ...trustedContacts,
      { name: "", phone: "", email: "", relation: "" },
    ]);
  };

  const removeContact = (index: number) => {
    const newContacts = trustedContacts.filter((_, i) => i !== index);
    setTrustedContacts(newContacts);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          trustedContacts: trustedContacts.filter((c) => c.name && c.phone),
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      updateUser(data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
      });
      setTrustedContacts(user.trustedContacts || []);
    }
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Profile & Settings
          </h2>
          <p className="text-muted-foreground">
            Manage your personal information and trusted contacts.
          </p>
        </div>
        {!isEditing ? (
          <div className="flex gap-2">
            <Button
              onClick={logout}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" /> Log Out
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="ghost" size="sm">
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} size="sm">
              <Check className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* Personal Info */}
        <Card className="border-border bg-card w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                disabled={!isEditing}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                disabled={!isEditing}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input disabled value={user.email} className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed directly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trusted Contacts */}
        <Card className="border-border bg-card w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Trusted Circle
            </CardTitle>
            {isEditing && (
              <Button onClick={addContact} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {trustedContacts.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No trusted contacts added yet.
              </p>
            )}

            {trustedContacts.map((contact, index) => (
              <div
                key={index}
                className="relative grid gap-4 rounded-lg border border-border bg-secondary/30 p-4 md:grid-cols-2 lg:grid-cols-4"
              >
                <div className="space-y-2">
                  <Label className="text-xs">Name</Label>
                  <Input
                    disabled={!isEditing}
                    value={contact.name}
                    onChange={(e) =>
                      handleContactChange(index, "name", e.target.value)
                    }
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Phone</Label>
                  <Input
                    disabled={!isEditing}
                    value={contact.phone}
                    onChange={(e) =>
                      handleContactChange(index, "phone", e.target.value)
                    }
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Email (Optional)</Label>
                  <Input
                    disabled={!isEditing}
                    value={contact.email || ""}
                    onChange={(e) =>
                      handleContactChange(index, "email", e.target.value)
                    }
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Relation</Label>
                  <Input
                    disabled={!isEditing}
                    value={contact.relation || ""}
                    onChange={(e) =>
                      handleContactChange(index, "relation", e.target.value)
                    }
                    className="h-9"
                  />
                </div>

                {isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 md:top-1/2 md:-translate-y-1/2 md:right-2 md:bg-transparent md:text-destructive md:hover:bg-destructive/10"
                    onClick={() => removeContact(index)}
                  >
                    <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
