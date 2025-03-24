"use server";
import {db,auth} from '@/firebase/admin';

import {cookies} from 'next/headers';
const OneWeek = 60*60*24*7;
export async function signUp (params: SignUpParams) {

  
    const {uid,name,email} = params;
   
    try{
  const userRecord = await db.collection('users').doc(uid).get();
    if(userRecord.exists){
        return{
            success:false,
            message:"User already exists"
        }
    }
  await db.collection('users').doc(uid).set({ 
    name,email
  })

}catch(e:any){
        console.error('Error creating a user',e);

        if(e.code==='auth/email-already-exists'){
           return{
                          success:false,
                          message:"This email already in use ."
           }
        }
        return{
            success:false,
            message:"Something went wrong"
        }
    }
}

export async function signIn(params: SignInParams){
    const {email,idToken}=params;

    try{const userRecord = await auth.getUserByEmail(email);
    if(!userRecord){
        return{
            success:false,
            message:"User not found"
        }
    }await setSessionCookies(idToken);

    }catch(e){
console.log(e);
    }
}


export async function setSessionCookies(idToken:string){
const CookieStore = await cookies();

const sessionCookie  =await auth.createSessionCookie(idToken,{expiresIn:OneWeek*1000,});

cookieStore.set('session',sessionCookie,{
 maxAge:OneWeek,
    httpOnly:true,
    secure:process.env.NODE_ENV==='production',
    sameSite:'lax'
})

}