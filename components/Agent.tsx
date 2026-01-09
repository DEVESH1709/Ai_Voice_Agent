"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [generatedInterviewId, setGeneratedInterviewId] = useState<string | null>(null);
  const [generateParams, setGenerateParams] = useState<Record<string, unknown> | null>(null);
  const handledFinishRef = useRef(false);

  useEffect(() => {
    const onCallStart = () => {
      handledFinishRef.current = false;
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
        return;
      }

      // When using Vapi Workflows, metadata often arrives via tool/function messages.
      // We store what we can so we can create the interview on our backend.
      if (message.type === "function-call") {
        const params = (message.functionCall?.parameters ?? null) as
          | Record<string, unknown>
          | null;
        if (params && typeof params === "object") {
          setGenerateParams(params);
        }
        return;
      }

      if (message.type === "function-call-result") {
        const result = (message.functionCallResult?.result ?? null) as
          | Record<string, unknown>
          | null;

        const id =
          (result && typeof result === "object" &&
          (typeof result.interviewId === "string"
            ? result.interviewId
            : typeof result.id === "string"
              ? result.id
              : null)) || null;

        if (id) setGeneratedInterviewId(id);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: unknown) => {
      // Extract error message from various error formats
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object") {
        // Handle Vapi's error object format
        const errObj = error as Record<string, unknown>;
        errorMessage =
          String(errObj.message || errObj.error || errObj.msg || "");
      }

      // Suppress empty errors and expected call-end errors
      const isEmpty =
        !error ||
        (typeof error === "object" && Object.keys(error).length === 0);
      const isCallEndError = /meeting ended|meeting has ended|ejection/i.test(
        errorMessage
      );

      if (isEmpty || isCallEndError) {
        setIsSpeaking(false);
        setCallStatus(CallStatus.FINISHED);
        return;
      }

      // Only log actual unexpected errors
      console.warn("Vapi error:", errorMessage || error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    const handleGenerateInterview = async () => {
      // If the workflow already returned an ID, just go there.
      if (generatedInterviewId) {
        router.push(`/interview/${generatedInterviewId}`);
        return;
      }

      // Otherwise try to create it ourselves using any parameters the workflow sent.
      if (generateParams && userId) {
        try {
          const response = await fetch("/api/vapi/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...generateParams, userId }),
          });

          const data = (await response.json()) as {
            success?: boolean;
            interviewId?: string;
            error?: string;
          };

          if (data?.success && data?.interviewId) {
            router.push(`/interview/${data.interviewId}`);
            router.refresh();
            return;
          }
        } catch (error) {
          console.error("Failed to create interview:", error);
        }
      }

      // Fallback: at least return to dashboard.
      router.push("/");
      router.refresh();
    };

    if (callStatus === CallStatus.FINISHED) {
      if (handledFinishRef.current) return;
      handledFinishRef.current = true;

      if (type === "generate") {
        handleGenerateInterview();
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId, generatedInterviewId, generateParams]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    try {
      if (type === "generate") {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isCallEndError = /meeting ended|meeting has ended|ejection/i.test(
        errorMessage
      );

      if (isCallEndError) {
        setCallStatus(CallStatus.FINISHED);
        return;
      }

      console.error("Failed to start call:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
