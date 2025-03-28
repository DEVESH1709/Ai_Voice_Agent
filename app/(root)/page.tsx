import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {dummyInterviews} from "@/constants"
import InterviewCard from "@/components/InterviewCard";
import {getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews} from "@/lib/actions/general.action";
const Page=async()=> {

  const user =await getCurrentUser();
const [userInterviews, latestInterviews]= await Promise.all([
  await getInterviewsByUserId(user?.id!),
  await getLatestInterviews({userId:user?.id!}),
])

 

  const hasPastIntervies= userInterviews.length > 0;
 const hasUpcomingInterviews =latestInterviews?.length>0;
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
    {

      hasPastIntervies?(
        userInetrviews?.map((interview)=>(
          <InterviewCard {...interview} key={interview.id} />
        ))
      ):(
        <p>You havn&apos;t taken any interviews yet</p>
      )
    
    
    }
    </div>

   </section>

   <section className="flex flex-col gap-6 mt-8" >
    <h2>Take an Interviews</h2>
    <div className="inerviews-section">
    {

hasUpcomingInterveiws?(
  latestInterviews?.map((interview)=>(
    <InterviewCard {...interview} key={interview.id} />
  ))
):(
  <p>There are no new interviews available </p>
)

 
}
    </div>
   </section>
   </>
   
  );
}
