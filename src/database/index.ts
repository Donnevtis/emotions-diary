import {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'

import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import dynamodb from './client'
import { validateUser } from '../utils/validators'
import { errorHandler } from '../utils/common'
import { CONDITION_CHECK_FAILED } from '../utils/constants'
import { ChatMember } from 'typegram'
import { Context } from 'telegraf'
import { User } from './database.types'

const dbErrorHandler = errorHandler('Database exception')

export const putUser = async (userData: Context['from']) => {
  if (!validateUser(userData)) {
    throw new Error(
      `Validation exception: invalid user data:
        ${JSON.stringify(validateUser.errors)}`,
    )
  }

  const {
    id,
    first_name = null,
    last_name = null,
    username,
    language_code,
    is_bot,
  } = userData

  try {
    const input = new PutItemCommand({
      TableName: 'Users',
      Item: marshall({
        PK: `user#${id}`,
        SK: `#metadata#${id}`,
        first_name,
        last_name,
        username,
        is_bot,
        registration_date: Date.now(),
        language_code,
        status: 'member',
      }),
      ConditionExpression: 'attribute_not_exists(SK)',
    })

    return await dynamodb.send(input)
  } catch (error) {
    if (error instanceof Error && error.name === CONDITION_CHECK_FAILED) {
      return setStatus(id, 'member')
    }

    return dbErrorHandler(error, putUser.name, userData)
  }
}

export const setStatus = (id: number, status: ChatMember['status']) =>
  dynamodb
    .send(
      new UpdateItemCommand({
        TableName: 'Users',
        Key: marshall({
          PK: `user#${id}`,
          SK: `#metadata#${id}`,
        }),
        UpdateExpression: 'set status = :s',
        ExpressionAttributeValues: marshall({
          ':s': status,
        }),
      }),
    )
    .catch(error => dbErrorHandler(error, setStatus.name, { id, status }))

//ISSUE: TransactWriteItemsCommand does not work with a single table
export const kickUser = (id: number) => {
  const input = new DeleteItemCommand({
    TableName: 'Users',
    Key: marshall({
      PK: `user#${id}`,
      SK: 'reminders',
    }),
  })

  return Promise.all([setStatus(id, 'kicked'), dynamodb.send(input)]).catch(
    error => dbErrorHandler(error, kickUser.name, { id }),
  )
}

export const updateReminderTimers = (
  id: number,
  reminder_timers: Array<number>,
  time_offset: number,
) =>
  dynamodb
    .send(
      new UpdateItemCommand({
        TableName: 'Users',
        Key: marshall({
          PK: `user#${id}`,
          SK: 'reminders',
        }),
        UpdateExpression: 'set timers = :t, user_id = :i, time_offset = :o',
        ExpressionAttributeValues: marshall({
          ':t': reminder_timers,
          ':i': id,
          ':o': time_offset,
        }),
      }),
    )
    .catch(error =>
      dbErrorHandler(error, updateReminderTimers.name, {
        id,
        reminder_timers,
        time_offset,
      }),
    )

export const updateLanguageSettings = (id: number, language_code: string) =>
  dynamodb
    .send(
      new UpdateItemCommand({
        TableName: 'Users',
        Key: marshall({
          PK: `user#${id}`,
          SK: `#metadata#${id}`,
        }),
        UpdateExpression: 'set language_code = :l',
        ExpressionAttributeValues: marshall({
          ':l': language_code,
        }),
      }),
    )
    .catch(error =>
      dbErrorHandler(error, updateLanguageSettings.name, {
        id,
        language_code,
      }),
    )

export const addState = (
  id: number,
  emotion: string,
  energy: number,
  timestamp: number,
) =>
  dynamodb
    .send(
      new UpdateItemCommand({
        TableName: 'Users',
        Key: marshall({
          PK: `user#${id}`,
          SK: `emotion#${id}#${timestamp}`,
        }),
        UpdateExpression: 'set emotion = :em, energy=:en, timestamp = :t',
        ExpressionAttributeValues: marshall({
          ':em': emotion,
          ':en': energy,
          ':t': timestamp,
        }),
      }),
    )
    .catch(error =>
      dbErrorHandler(error, addState.name, {
        id,
        emotion,
        energy,
        timestamp,
      }),
    )

export const getEmotionsById = async (id: number) => {
  try {
    const input = new QueryCommand({
      TableName: 'Users',
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :emotion)',
      ExpressionAttributeValues: marshall({
        ':pk': `user#${id}`,
        ':emotion': `emotion#${id}`,
      }),
      ProjectionExpression: 'emotion, energy, timestamp',
    })

    const { Items } = await dynamodb.send(input)

    return Items?.length ? Items.map(emotion => unmarshall(emotion)) : null
  } catch (error) {
    return dbErrorHandler(error, getEmotionsById.name, {
      id,
    })
  }
}

export const getTimerById = async (id: number) => {
  try {
    const input = new GetItemCommand({
      TableName: 'Users',
      Key: marshall({
        PK: `user#${id}`,
        SK: 'reminders',
      }),
      ProjectionExpression: 'timers, time_offset',
    })

    const { Item } = await dynamodb.send(input)

    return Item ? unmarshall(Item) : null
  } catch (error) {
    return dbErrorHandler(error, getTimerById.name, {
      id,
    })
  }
}

export const getUser = async (id: number): Promise<User | null> => {
  try {
    const input = new GetItemCommand({
      TableName: 'Users',
      Key: marshall({
        PK: `user#${id}`,
        SK: `#metadata#${id}`,
      }),
    })

    const { Item } = await dynamodb.send(input)

    return Item ? (unmarshall(Item) as User) : null
  } catch (error) {
    return dbErrorHandler(error, getUser.name, {
      id,
    })
  }
}

export const findUsersByTimer = async (time: number) => {
  try {
    const input = new QueryCommand({
      TableName: 'Users',
      IndexName: 'InvertedIndex',
      KeyConditionExpression: 'begins_with(SK, :sk)',
      FilterExpression: 'contains(timers, :t)',
      ExpressionAttributeValues: marshall({
        ':sk': 'reminders',
        ':t': time,
      }),
      ProjectionExpression: 'user_id',
      ScanIndexForward: true,
    })

    const { Items } = await dynamodb.send(input)

    return Items?.length ? Items.map(user => unmarshall(user)) : null
  } catch (error) {
    return dbErrorHandler(error, findUsersByTimer.name, {
      time,
    })
  }
}
