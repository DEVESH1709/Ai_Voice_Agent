import { getInterviewsById } from '@/lib/actions/general.sction';
import React from 'react'
import { redirect } from 'next/navigation';
import DisplayTechIcons from '@/components/DisplayTechicons';
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';
const page = ({params}:RouteParams) => {

    const {id}=await params;
    const user= await getCurrentUser();
    const interview=await getInterviewsById(id);

    if(!interview) redirect('/')
  return (
    <>

    <div className='flex fkex-row gap-4 justify-between'>

        <div className='flex flex-row gap-4 items-center max-sm:flex-col'>
            <div className='flex flex-col gap-4 items-center'> 
              <Image src={getRandomInterviewCover()} alt="cover-image" width={40} height={40} className="rounded-full object-cover size-[40px]"></Image>
              <h3 className='capitalize'>{interview.role} </h3>
            </div>

            <DisplayTechIcons techStack={interview.techstack}></DisplayTechIcons>

            <p className='bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize'>{interview.type}</p>
        </div>

        <Agent userName={user?.name} type={user?.id} interviewId={id} type="interview" question={interview.questions} >

        </Agent>
    </div>
    </>
  )
}

export default page