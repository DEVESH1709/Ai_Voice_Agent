
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

  return{
    success:true,
    message:"User created successfully, please sign in "
  }

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
const cookieStore = await cookies();

const sessionCookie  =await auth.createSessionCookie(idToken,{expiresIn:OneWeek*1000,});

cookieStore.set('session',sessionCookie,{
 maxAge:OneWeek,
    httpOnly:true,
    secure:process.env.NODE_ENV==='production',
    path:"/",
    sameSite:"lax",
})

}


export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
  
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;
  
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
   
      const userRecord = await db
        .collection("users")
        .doc(decodedClaims.uid)
        .get();
      if (!userRecord.exists) return null;
  
      return {
        ...userRecord.data(),
        id: userRecord.id,
      } as User;
    } catch (error) {
      console.log(error);
  
   
      return null;
    }
  }
  

  export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
  }
  

  export async function getInterviewsByUserId(userId:string):Promise<Interview[] |null>{
   const interviews =await db.collection('interviews').where('userId','==',userId).orderBy('createdAt','desc').get();
 
return interviews.docs.map((docs)=>({
    id:docs.id,
    ...docs.data(),
}))as Interview[];

}


export async function getLatestInterviews(params:GetLatestInterviewsParams):Promise<Interview[] |null>{
    const {userId,limit=20} = params;
    const interviews =await db.collection('interviews').orderBy('createdAt','desc').where('finalized','==',true).where('userId','!=',userId).limit(limit).get();
  
 return interviews.docs.map((docs)=>({
     id:docs.id,
     ...docs.data(),
 }))as Interview[];
 
 }