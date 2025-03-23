import React from 'react'
import dayjs fr om 'dayjs';
import Image from 'next/image';
import {getRandomInterviewCover} from '@/public/utils'

const InterviewCard = ({interviewId,userId,role,type,techstack,createdAt}:InterviewCardProps) => {
 const feedback =null Feedback |null;
 const normalizedType = /mix/gi.test(type)?'Mixed' : type;
 const formattedData = dayjs(feedback?.createdAt || createdAt|| Date.now()).format('MMM D, YYYY')
 
 
    return (

    <div className='card-border w-[360px] max-sm:w-full min-h-96'>
        <div className='card-interview'>
<div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
    <p className='badge-text'>{normalizedType}</p>
</div>
<Image src={getRandomInterviewCover()} alt="cover image" width={90} height={90} className="rounded-full boject-fit size-[90px]"></Image>

<h3 className='mt-5 capitalize'> {role} Interview</h3></div>
<div className='flex flex-row gap-5 mt-3'>
    <div className='flex flex-row gap-2'>
        <Image src="/calender.svg " alt="calender" width={22} height={22}></Image>
        <p>{formattedDate}</p>
    </div>
<div className='flex flex-row gap-2 items-center'>
    <Image src="/star.svg" alt="star" width={22} height={22}></Image>
    <p > {feedback?.totalScore || '---'}/100</p>
</div>

</div>
        </div>
        </div>
    </div>
  )
}
 
export default InterviewCard