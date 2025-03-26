import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import DisplayTechicons from "./DisplayTechicons";


type InterviewCardProps = {
  interviewId: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
};

type Feedback = {
  createdAt?: string;
  totalScore?: number;
  finalAssessment?: string;
};

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback = null as Feedback | null;

  // Normalize interview type display
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  // Format the date
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        {/* Interview Type Badge */}
        <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
          <p className="badge-text">{normalizedType}</p>
        </div>

        {/* Interview Cover Image */}
        <Image
          src={getRandomInterviewCover() || "/default-cover.png"}
          alt="Interview Cover"
          width={90}
          height={90}
          className="rounded-full size-[90px]"
        />

        {/* Interview Role */}
        <h3 className="mt-5 capitalize">{role} Interview</h3>

        {/* Interview Details */}
        <div className="flex flex-row gap-5 mt-3">
          {/* Date */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/calendar.svg" alt="Calendar" width={22} height={22} />
            <p>{formattedDate}</p>
          </div>

          {/* Score */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" alt="Star" width={22} height={22} />
            <p>{feedback?.totalScore || "---"}/100</p>
          </div>
        </div>

        {/* Interview Assessment */}
        <p className="line-clamp-2 mt-5">
          {feedback?.finalAssessment || "You have not taken the interview yet. Take it now to improve your skills."}
        </p>
      </div>

      {/* Tech Stack & Action Button */}
      <div className="flex flex-row justify-between mt-4">
        <DisplayTechicons techStack={techstack} />
        <Button asChild className="btn-primary">
          <Link href={feedback ? `/interviews/${interviewId}/feedback` : `/interviews/${interviewId}`}>
            {feedback ? "Check Feedback" : "View Interview"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default InterviewCard;
