"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface TrustedContact {
  name: string;
  phone: string;
  email: string;
  relation: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([
    { name: "", phone: "", email: "", relation: "" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleContactChange = (
    index: number,
    field: keyof TrustedContact,
    value: string,
  ) => {
    const newContacts = [...trustedContacts];
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Filter out empty contacts
      const validContacts = trustedContacts.filter((c) => c.name && c.phone);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          trustedContacts: validContacts,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      login(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl border-border bg-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your details and add trusted contacts to get started
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Jane Doe"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 234 567 890"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  Trusted Contacts
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addContact}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Contact
                </Button>
              </div>

              {trustedContacts.map((contact, index) => (
                <div
                  key={index}
                  className="relative grid gap-4 rounded-lg border border-border bg-secondary/30 p-4 md:grid-cols-2"
                >
                  <div className="space-y-2">
                    <Label>Contact Name</Label>
                    <Input
                      placeholder="Mom, Dad, etc."
                      value={contact.name}
                      onChange={(e) =>
                        handleContactChange(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      placeholder="+1 234..."
                      value={contact.phone}
                      onChange={(e) =>
                        handleContactChange(index, "phone", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email (Optional)</Label>
                    <Input
                      placeholder="contact@example.com"
                      value={contact.email}
                      onChange={(e) =>
                        handleContactChange(index, "email", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relation (Optional)</Label>
                    <Input
                      placeholder="Parent, Friend, etc."
                      value={contact.relation}
                      onChange={(e) =>
                        handleContactChange(index, "relation", e.target.value)
                      }
                    />
                  </div>
                  {trustedContacts.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 text-destructive hover:bg-destructive/10"
                      onClick={() => removeContact(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="underline hover:text-primary">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
