'use server'
import {createSessionClient, createAdminClient} from '../appwrite'
import { ID, Query } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from '../utils';
import { Products, CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, } from 'plaid'
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
import {plaidClient} from '@/lib/plaid'
import { revalidatePath } from "next/cache";


const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;


export const getUserInfo = async ({userId}:getUserInfoProps) => {
    try {
    const {database} = await createAdminClient()

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )
    return parseStringify(user.documents[0])
  } catch (error) {
    console.log(error)
  }
}

export const signIn = async ({email, password} : signInProps) =>{
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

   (await cookies()).set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

    const user = await getUserInfo({userId : session.userId})

    return parseStringify(user)
  } catch (error) {
    console.error('Error', error)
  }
}

export const signUp = async ({password,...userData} : SignUpParams) =>{
  const {email, lastName, firstName} = userData

  let newUserAccount;
  try {
    const { account, database } = await createAdminClient();

  newUserAccount =  await account.create(
    ID.unique(),
    email,
    password,
    `${firstName} ${lastName}`
      );

  if(!newUserAccount) throw new Error("Error creating user");

  const dwollaCustomerUrl = await createDwollaCustomer({
    ...userData,
    type: 'personal',
  })

  if(!dwollaCustomerUrl) throw new Error("Error creating dwolla");
  
  const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl)

  const newUser = await database.createDocument(
    DATABASE_ID!,
    USER_COLLECTION_ID!,
    ID.unique(),
    {
      ...userData,
      userId: newUserAccount.$id,
      dwollaCustomerId,
      dwollaCustomerUrl
    }
  )
      
  const session = await account.createEmailPasswordSession(email, password);

   (await cookies()).set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return parseStringify(newUser)
  } catch (error) {
    console.error('Error', error)
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();

    const result =  await account.get();

    const user = await getUserInfo({userId: result.$id})
    
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

export const createLinkToken = async (user:User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ['auth'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    }
    const response = await plaidClient.linkTokenCreate(tokenParams)
    return parseStringify({linkToken: response.data.link_token})
  } catch (error) {
    console.error(error)
  }
}

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}:createBankAccountProps) => {
  try {
    const {database} = await createAdminClient()
    const bankAccount = await database.createDocument(
      ID.unique(),
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    )
    return parseStringify(bankAccount)
  } catch (error) {
    console.error('Error parseing bank account')
  }
}

export const exchangePublicToken = async ({
  publicToken,
  user
}:exchangePublicTokenProps) => {
  try {
    //Exchange public token for access token and item id
    const response = await plaidClient.itemPublicTokenExchange({
      public_token:publicToken
    })

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    //Get account from plaid using access token
    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken
    })

    const accountData = accountResponse.data.accounts[0]

       // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

      // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
     const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    
    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error('An error occred while craating exchange token',error)
  }
}

export const getBanks = async ({userId}:getBanksProps) => {
  try {
    const {database} = await createAdminClient()

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )
    return parseStringify(banks.documents)
  } catch (error) {
    console.log(error)
  }
}

export const getBank = async ({documentId}:getBanksProps) => {
  try {
    const {database} = await createAdminClient()

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    )
    return parseStringify(bank.documents[0])
  } catch (error) {
    console.log(error)
  }
}