import React from 'react'
import Image from 'next/image'

enum CallStatus{
    INACTIVE:'INACTIVE',
    CONNECTING:'CONNECTING',
    ACTIVE:'ACTIVE',
    FINISHED:'FINISHED',
}
const Agent = () => {
const isSpeaking = true;
const isSpeaking =true;
const message={
    'Whats your name?',
    'My name is John Doe, nice to meet you !'
};
const lastMessage =message[message.length-1]; 

  return (
    <>
    <div className='call-view'>
    
    <div className='card-interview'>


        <div className='avatar'>
            <Image src="/ai-avatar.png"  alt="vapi" width={65} height={54} className="object-cover" ></image>

            {isSpeaking && <span className="animate-speak"></span>}
        </div>

        <h3>AI Interviewer</h3>
    </div>
    <div className='card-border'>
    <div className='card-content'>
        <Image src="/user-avatar.png"  alt="user-avatar" width={540} height={540} className='rounded-full object-cover size-[120px'>
        
        </Image>
        <h3>{userName}</h3>

    </div>
    </div>
    </div>

    {messages.length>0 &&(
        <div className='transcript'>
        <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>
        {lastMessage}
        </p></div>
    )}
<div className='w-full flex justify-center'>
{
    callStatus !==='ACTIVE'?(
        <button className='relative btn-call '> 
            <span className={cn('absolute animate-ping rounded-full opacity-75', callsStatus!==='CONNECTING' &'hidden')}>
          
            </span>

            <span>
            {callStatus=== 'INACTIVE' || callStatus ==='FINISHED'?'Call':'....'}
            </span>
        </button>
    ):(
        <button className='btn-disconnect'>
            End
        </button>
    )
}
</div>
    </>
  )
}

export default Agent