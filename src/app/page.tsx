"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PhoneInput, { Value as PhoneValue } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useIntegrationApp } from "@integration-app/react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

enum Pronouns {
  HeHim = "He/Him",
  SheHer = "She/Her",
  TheyThem = "They/Them",
  Other = "Other",
}

const HUBSPOT_PROJECT_ID = 48077114;

const Page: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: undefined as unknown as PhoneValue,
    companyName: "",
    pronouns: Pronouns.Other,
  });
  const [hubspotLink, setHubspotLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const integrationApp = useIntegrationApp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value: PhoneValue) => {
    setFormData((prevData) => ({
      ...prevData,
      phone: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await integrationApp
        .connection("hubspot")
        .action("create-contact")
        .run({
          firstName: formData.firstName,
          lastName: formData.lastName,
          primaryEmail: formData.email,
          primaryPhone: formData.phone,
          pronouns: formData.pronouns,
          companyName: formData.companyName,
        });

      if (response?.output?.id) {
        const hubspotLink = `https://app.hubspot.com/contacts/${HUBSPOT_PROJECT_ID}/contact/${response.output.id}`;
        setHubspotLink(hubspotLink);
        toast({
          title: "Contact Created",
          description:
            "Contact created successfully! You can view it in HubSpot.",
          duration: 1500,
          action: (
            <a
              href={hubspotLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Contact in HubSpot
            </a>
          ),
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Create contact</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <PhoneInput
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            required
            className="border border-gray-300 rounded-md w-full p-2"
          />
        </div>
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="pronouns">Pronouns</Label>
          <Select
            value={formData.pronouns}
            onValueChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                pronouns: value as Pronouns,
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your pronouns" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Pronouns).map((pronoun) => (
                <SelectItem key={pronoun} value={pronoun}>
                  {pronoun}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {loading ? (
          <Button disabled>
            <Loader2 className="animate-spin mr-2" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </form>
      {hubspotLink && (
        <div className="mt-6">
          <p>Contact created successfully! You can view it in HubSpot:</p>
          <a
            href={hubspotLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Contact in HubSpot
          </a>
        </div>
      )}
    </div>
  );
};

export default Page;
