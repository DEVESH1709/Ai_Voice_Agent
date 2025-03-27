"use client";
import Image from 'next/image'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {vapi} from "@/lib/vapi.sdk" ;
import { cn } from "@/lib/utils";

enum CallStatus{
    INACTIVE='INACTIVE',
    CONNECTING='CONNECTING',
    ACTIVE='ACTIVE',
    FINISHED='FINISHED',
}

interface SavedMessage {
    role: 'user' | 'system' |'assistent';
    content:string;
}





const Agent = ({userName,userId,type}:AgentProps) => {
const router = useRouter();
const [isSpeaking, setIsSpeaking] = useState(false);
const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
const [message, setMessage] = useState<SavedMessage[]>([]);

useEffect(() => {
    const onCallStart=()=>{setCallStatus(CallStatus.ACTIVE)};
const onCallEnd=()=>{setCallStatus(CallStatus.FINISHED)};

const onCMessage=(message:Message)=>{
    if(message.type==='transcript'&& message.transcriptType==='final'){
        const newMessage ={role:message.role, content:message.transcript}

        setMessages((prev))=>[...prev, newMessage]);

    }


const onSpeechStart=()=>setIsSpeaking(true);
const onSpeechEnd =()=>setSpeaking(false);

const onError =(error:Error)=>console.log('Error',error);

vapi.on('call:start',onCallStart);
vapi.on('call:end',onCallEnd);
vapi.on('message',onMessage);
vapi.on('speech:start',onSpeechStart);
vapi.on('speech:end',onSpeechEnd);
vapi.on('error',onError);


return ()=>{
    vapi.off('call:start',onCallStart);
vapi.off('call:end',onCallEnd);
vapi.off('message',onMessage);
vapi.off('speech:start',onSpeechStart);
vapi.off('speech:end',onSpeechEnd);
vapi.off('error',onError);
}



},[])

useEffect(()=>{
if(callStatus ===CallStatus.FINISHED)router.push('/');
   
},[messages,callStatus,type,userId])


const handelCall = async()=>{
    setCallStuss(CallStatus.CONNECTING);

    await vapi.start({
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID},{
            variableValues:{
                username:userName,
                userid:userId,
                

            }
        })
}

const handelDisconnect= async()=>{
    seCallStatus(CallStatus.FINISHED);

    vapi.stop()
}

const latestMessage= messages[messages.length-1]?.content;
const isCallInactiveOrFinished =callStatus ===CallStatus.INACTIVE || callStatus ===CallStatus.FINISHED;

// const callStatus =CallStatus.FINISHED;
// const isSpeaking =true;
// const messages=[
//     'Whats your name?',
//     'My name is John Doe, nice to meet you !'
// ];
// const lastMessage =messages[messages.length-1]; 

  return (
    <>
    <div className='call-view'>
    
    <div className='card-interview'>


        <div className='avatar'>
            <Image src="/ai-avatar.png"  alt="vapi" width={65} height={54} className="object-cover" ></Image>

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

    {messages.length >0 &&(
        <div className='transcript-border'>
        <div className='transcript'>
        <p key={latestMessageMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>
        {latestMessage}
        </p></div>
        </div>
    )}
<div className='w-full flex justify-center'>
{
    callStatus !=='ACTIVE'?(
        <button className='relative btn-call ' onClick={handelCall}> 
            <span className={cn('absolute animate-ping rounded-full opacity-75', callsStatus!=='CONNECTING' &&'hidden')}>
          
            </span>

            <span className='relative'>
          {isCallInactiveOrFinished?"Call":". . . "}
            </span>
        </button>
    ):(
        <button className='btn-disconnect' onClick={handelDisconnect}>
            End
        </button>
    )
}
</div>
    </>
  )
}

export default Agent