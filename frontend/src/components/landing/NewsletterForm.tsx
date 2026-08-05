"use client";

import { useState, type FormEvent } from "react";
import { apiPost } from "@/lib/api";

type SubscriberData = {
  id: number;
  email: string;
  createdAt: string;
};

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVALID_EMAIL_MESSAGE = "Lütfen geçerli bir e-posta adresi giriniz.";

function validateEmail(value: string): string | null {
  const email = value.trim();

  if (!email || !EMAIL_PATTERN.test(email)) {
    return INVALID_EMAIL_MESSAGE;
  }

  return null;
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    const clientError = validateEmail(email);

    if (clientError) {
      setStatus("error");
      setMessage(clientError);
      return;
    }

    setStatus("loading");
    setMessage(null);

    const result = await apiPost<SubscriberData>("/subscribers", {
      email: email.trim().toLowerCase(),
    });

    if (result.success) {
      setStatus("success");
      setMessage(result.message);
      setEmail("");
      return;
    }

    setStatus("error");
    setMessage(result.errors?.email?.[0] ?? result.message);
  }

  const isLoading = status === "loading";
  const hasError = status === "error";

  return (
    <div className="rounded-xl bg-[#19161C] p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-white">Solana Developer Update</h3>
      <p className="mt-2 text-sm text-[#C4C4C4]">
        Sign up to the newsletter and learn about new resources, new commits, new proposals, and more.
      </p>

      <form onSubmit={handleSubmit} className="mt-5" noValidate>
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <div
          className={`flex items-center gap-2 rounded-full bg-black p-1.5 pl-4 ${
            hasError ? "ring-1 ring-red-500" : ""
          }`}
        >
          <input
            id="newsletter-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === "error" || status === "success") {
                setStatus("idle");
                setMessage(null);
              }
            }}
            placeholder="Email"
            disabled={isLoading}
            aria-invalid={hasError}
            aria-describedby="newsletter-feedback"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-zinc-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="shrink-0 cursor-pointer rounded-full bg-[#14F195] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white hover:text-[#14F195] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#14F195] disabled:hover:text-black"
          >
            {isLoading ? "Sending..." : "SIGN UP"}
          </button>
        </div>
      </form>

      {message && (
        <p
          id="newsletter-feedback"
          role="status"
          className={`mt-3 text-sm ${status === "success" ? "text-[#14F195]" : "text-red-400"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
