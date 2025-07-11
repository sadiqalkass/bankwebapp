'use server'
import {createSessionClient, createAdminClient} from '../appwrite'
import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseStringify } from '../utils';

export const signIn = async ({email, password} : signInProps) =>{
  try {
    const { account } = await createAdminClient();

    const response = await account.createEmailPasswordSession(email, password)

    return parseStringify(response)
  } catch (error) {
    console.error('Error', error)
  }
}
export const signUp = async (userData : SignUpParams) =>{
  const {email, password, lastName, firstName} = userData
  try {
    const { account } = await createAdminClient();

  const newUserAccount =  await account.create(
    ID.unique(),
    email,
    password,
    `${firstName} ${lastName}`
      );
  const session = await account.createEmailPasswordSession(email, password);

   (await cookies()).set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  return parseStringify(newUserAccount)
  } catch (error) {
    console.error('Error', error)
  }
}

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();

    const user =  await account.get();
    return parseStringify(user)
  } catch (error) {
    return null;
  }
}

export const loggoutAccount = async () => {
  try {
    const  {account} = await createSessionClient();
    (await cookies()).delete('appwrite-session')
    await account.deleteSession('current')
  } catch (error) {
    console.error(error)
    return null
  }
}