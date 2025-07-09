"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormRenderer from "@/features/FormRenderer/FormRenderer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import "./style.css";
// Animation pattern (same as reference)
const sectionSlideIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1],
  },
};

const RegisterPage = () => {
  const params = useParams();
  const id = params.id;

  const [jsonStringConfig, setJsonStringConfig] = useState(""); // ✅ Final JSON string
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState("");
  const [eventId, setEventId] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        const event = data.event;
        setEventName(event.title);
        setEventId(event._id);
        if (event?.formConfig) {
          let finalConfig = event.formConfig;

          if (typeof finalConfig === "string") {
            try {
              finalConfig = JSON.parse(finalConfig);
            } catch (err) {
              console.error("formConfig string is not valid JSON", err);
              return setJsonStringConfig("");
            }
          }

          const asString = JSON.stringify(finalConfig, null, 4);
          setJsonStringConfig(asString);
        } else {
          console.warn("formConfig missing in event:", event);
        }
      } catch (err) {
        console.error("Failed to fetch event data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Skeleton className="h-8 w-1/2 mb-6" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!jsonStringConfig) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="text-red-500 h-10 w-10" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Form Not Available
          </h2>
          <p className="text-gray-600">
            No valid form configuration found for this event.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionSlideIn}
      className="mx-auto max-w-4xl"
    >
      <FormRenderer
        jsonConfig={jsonStringConfig}
        onSubmit={async (formData) => {
          try {
            const res = await fetch(`/api/events/${eventId}/register`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (!res.ok) {
              throw new Error(result.error || "Registration failed");
            }
            // Optional: show success toast or redirect
          } catch (err) {
            console.error("❌ Registration error:", err);
            // Optional: show error toast
          }
        }}
        id={eventName}
      />
    </motion.div>
  );
};

export default RegisterPage;
