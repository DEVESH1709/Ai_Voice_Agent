import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {dummyInterviews} from "@/constants"
import InterviewCard from "@/components/InterviewCard";
export default function Home() {
  return (
   <>
   <section className="card-cta">
    <div className="flex flex-col gap-6 max-w-lg"> 
  <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>

  <p className="text-lg">
    Practice on real interview question & get instance Feedback
  </p>

  <Button asChild className="btn-primary max-sm:w-full"></Button>
  <Link href="/interview ">Start an Interview</Link>
    </div>
      <Image src="/robot.png " alt="robo-dude" width={400} height={400} className="max-sm:hidden"></Image>
   </section>

   <section className="flex flex-col gap-6 mt-8">
    <h2>Your Interviews</h2>
    <div className="interviews-section">
    {dummyInterviews.map((interview) => (
  <InterviewCard {...interview} key={interview.id} />
))}

    </div>

   </section>

   <section className="flex flex-col gap-6 mt-8" >
    <h2>Take an Interviews</h2>
    <div className="inerviews-section">
    {dummyInterviews.map((interview) => (
  <InterviewCard {...interview} key={interview.id} />
))}

    </div>
   </section>
   </>
   
  );
}
