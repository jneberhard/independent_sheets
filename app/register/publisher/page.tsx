"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export default function PublisherRegisterPage() {

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    password: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "",
    biography: "",
    websiteUrl: "",
    youtubeUrl: "",
    spotifyUrl: "",
    primaryCategories: "",
    primaryVoicings: "",
    paypalEmail: "",
    preferredPaymentMethod: "",
    uploadingOriginalWorks: false,
    uploadingArrangements: false,
    ownsOrControlsRights: false,
    acceptedAgreement: false,
  });

  function updateField(
    field: keyof typeof formData,
    value: string | boolean
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!formData.acceptedAgreement) {
      alert("You must accept the publisher agreement.");
      return;
    }

    try {
      await authClient.signUp.email({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      });

      const response = await fetch("/api/register/publisher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setErrorMessage("Publisher account could not be created.");
        return;
      }

      router.push("/dashboard/publisher");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to register right now.";
      if (message.toLowerCase().includes("user already exists")) {
        setErrorMessage("An account with this email already exists. Please log in.");
        return;
      }
      setErrorMessage(message);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">
        Join Independent Sheets as a Composer or Arranger
      </h1>
      <p className="mt-3 text-base">
        Upload and sell your original compositions and licensed arrangements to musicians worldwide.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border">
        <Image
          src="/songwriter.png"
          alt="Composer or arranger signup"
          width={1200}
          height={500}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold">Become a Publisher on Independent Sheets</h2>
        <p>
          Independent Sheets allows composers, arrangers, and music creators to serve as the publisher
          of their own musical works through our digital marketplace.
        </p>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-semibold">Publisher Signup Form</h3>
        {errorMessage ? (
          <p className="mt-2 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}
        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <input className="rounded border p-2" placeholder="First Name *"
            value={formData.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            required />
          <input className="rounded border p-2" placeholder="Last Name *"
            value={formData.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            required />
          <input className="rounded border p-2 md:col-span-2" placeholder="Display/Publisher Name *"
            value={formData.displayName}
            onChange={(event) => updateField("displayName", event.target.value)}
            required />
          <input className="rounded border p-2" placeholder="Email Address *"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            required />
          <input className="rounded border p-2" placeholder="Password *"
            value={formData.password}
            onChange={(event) => updateField("password", event.target.value)}
            required />

          <input className="rounded border p-2" placeholder="Phone Number (Optional)"
            value={formData.phoneNumber}
            onChange={(event) => updateField("phoneNumber", event.target.value)}
            />
          <input className="rounded border p-2 md:col-span-2" placeholder="Address Line 1 *"
            value={formData.addressLine1}
            onChange={(event) => updateField("addressLine1", event.target.value)}
            required />
          <input className="rounded border p-2 md:col-span-2" placeholder="Address Line 2 (Optional)"
            value={formData.addressLine2}
            onChange={(event) => updateField("addressLine2", event.target.value)}
            />
          <input className="rounded border p-2" placeholder="City *"
            value={formData.city}
            onChange={(event) => updateField("city", event.target.value)}
            required />
          <input className="rounded border p-2" placeholder="State/Province *"
            value={formData.stateProvince}
            onChange={(event) => updateField("stateProvince", event.target.value)}
            required />
          <input className="rounded border p-2" placeholder="Postal Code *"
            value={formData.postalCode}
            onChange={(event) => updateField("postalCode", event.target.value)}
            required />
          <input className="rounded border p-2" placeholder="Country *"
            value={formData.country}
            onChange={(event) => updateField("country", event.target.value)}
            required />

          <textarea className="rounded border p-2 md:col-span-2" placeholder="About Me / Biography (Optional)"
            value={formData.biography}
            onChange={(event) => updateField("biography", event.target.value)}
          />
          <input className="rounded border p-2 md:col-span-2" placeholder="Website URL (Optional)"
            value={formData.websiteUrl}
            onChange={(event) => updateField("websiteUrl", event.target.value)}
          />
          <input className="rounded border p-2 md:col-span-2" placeholder="YouTube Channel (Optional)"
            value={formData.youtubeUrl}
            onChange={(event) => updateField("youtubeUrl", event.target.value)}
          />
          <input className="rounded border p-2 md:col-span-2" placeholder="Spotify Link (Optional)"
            value={formData.spotifyUrl}
            onChange={(event) => updateField("spotifyUrl", event.target.value)}
          />
          <input className="rounded border p-2 md:col-span-2" placeholder="Primary Categories (Optional)"
            value={formData.primaryCategories}
            onChange={(event) => updateField("primaryCategories", event.target.value)
            }
          />

          <input className="rounded border p-2 md:col-span-2" placeholder="Primary Voicings/Instruments (Optional)"
            value={formData.primaryVoicings}
            onChange={(event) => updateField("primaryVoicings", event.target.value)
            }
          />

          <input className="rounded border p-2" placeholder="PayPal Email (Optional)"
            value={formData.paypalEmail}
            onChange={(event) => updateField("paypalEmail", event.target.value)}
          />

          <input className="rounded border p-2" placeholder="Preferred Payment Method (Optional)"
            value={formData.preferredPaymentMethod}
            onChange={(event) => updateField("preferredPaymentMethod", event.target.value)
            }
          />

          <p className="flex items-start gap-2 text-sm md:col-span-2">
            For paid downloads, publishers receive <strong>75%</strong> of each sale. Independent Sheets retains{" "}
            <strong>25%</strong> as the platform fee.
          </p>

          <div className="flex items-start gap-2 text-sm md:col-span-2">
            <p className="font-semibold">Royalty / Payment</p>
            <p className="mt-1">
              Current royalty split: <strong>Publisher 75%</strong> / <strong>Independent Sheets 25%</strong>.
            </p>
          </div>

          <label className="flex items-start gap-2 text-sm md:col-span-2">
            <input
              type="checkbox"
              className="mt-1"
              checked={formData.acceptedAgreement}
              onChange={(event) =>
                updateField("acceptedAgreement", event.target.checked)
              }
              required
            />
            <span>
              I certify that I own the copyright to the uploaded material or have obtained
              the necessary permissions/licenses to distribute and sell this music. I
              understand and agree to the current royalty split: Publisher 75% /
              Independent Sheets 25%.
            </span>
          </label>

          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white transition hover:bg-blue-600 hover:shadow-lg md:col-span-2"
          >
            Create Publisher Account
          </button>
        </form>
      </section>
    </main>
  );
}
