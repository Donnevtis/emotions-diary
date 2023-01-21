import {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import TelegramBot from 'node-telegram-bot-api'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import dynamodb from './client'
import { validateUser } from '../utils/validators'
import { stringify } from '../utils/common'
import { CONDITION_CHECK_FAILED } from '../utils/constants'
import { ChatMember } from 'telegraf/typings/core/types/typegram'

export const putUser = async (userData: TelegramBot.User) => {
  if (!validateUser(userData)) {
    throw new Error(
      `Validation exception: invalid user data:
        ${stringify(validateUser.errors)}`,
    )
  }

  const { id, first_name, last_name, username, language_code, is_bot } =
    userData

  try {
    return await dynamodb.send(
      new PutItemCommand({
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
      }),
    )
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === CONDITION_CHECK_FAILED) {
        return setStatus(id, 'member')
      }

      console.error(
        'Database exception. putUser error: ',
        stringify(error),
        'User id: ',
        id,
      )

      return null
    }

    throw error
  }
}

export const setStatus = (id: number, status: ChatMember['status']) =>
  dynamodb.send(
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

//ISSUE: TransactWriteItemsCommand does not work with a single table
export const kickUser = (id: number) => {
  return Promise.all([
    setStatus(id, 'kicked'),
    dynamodb.send(
      new DeleteItemCommand({
        TableName: 'Users',
        Key: marshall({
          PK: `user#${id}`,
          SK: 'reminders',
        }),
      }),
    ),
  ])
}

export const updateReminderTimers = (
  id: number,
  reminder_timers: Array<number>,
) =>
  dynamodb.send(
    new UpdateItemCommand({
      TableName: 'Users',
      Key: marshall({
        PK: `user#${id}`,
        SK: 'reminders',
      }),
      UpdateExpression: 'set timers = :t, user_id = :i',
      ExpressionAttributeValues: marshall({
        ':t': reminder_timers,
        ':i': id,
      }),
    }),
  )

export const updateLanguageSettings = (id: number, language_code: string) =>
  dynamodb.send(
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

export const addEmotion = (id: number, emotion: string) => {
  const timestamp = Date.now()

  return dynamodb.send(
    new UpdateItemCommand({
      TableName: 'Users',
      Key: marshall({
        PK: `user#${id}`,
        SK: `emotion#${id}#${timestamp}`,
      }),
      UpdateExpression: 'set emotion = :e, timestamp = :t',
      ExpressionAttributeValues: marshall({
        ':e': emotion,
        ':t': timestamp,
      }),
    }),
  )
}

export const getEmotionsById = async (id: number) => {
  try {
    const { Items } = await dynamodb.send(
      new QueryCommand({
        TableName: 'Users',
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :emotion)',
        ExpressionAttributeValues: marshall({
          ':pk': `user#${id}`,
          ':emotion': `emotion#${id}`,
        }),
        ProjectionExpression: 'emotion, timestamp',
      }),
    )

    return Items?.length ? Items.map(emotion => unmarshall(emotion)) : null
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        'Database exception. getEmotionsById error: ',
        stringify(error),
        'User id: ',
        id,
      )
    }

    throw error
  }
}

export const getTimerById = async (id: number) => {
  try {
    const { Item } = await dynamodb.send(
      new GetItemCommand({
        TableName: 'Users',
        Key: marshall({
          PK: `user#${id}`,
          SK: 'reminders',
        }),
        ProjectionExpression: 'timers',
      }),
    )

    return Item ? unmarshall(Item) : null
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        'Database exception. getEmotionsById error: ',
        stringify(error),
        'User id: ',
        id,
      )
    }

    throw error
  }
}

export const getUser = async (id: number) => {
  try {
    const { Item } = await dynamodb.send(
      new GetItemCommand({
        TableName: 'Users',
        Key: marshall({
          PK: `user#${id}`,
          SK: `#metadata#${id}`,
        }),
      }),
    )

    return Item ? unmarshall(Item) : null
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        'Database exception. getUser error: ',
        stringify(error),
        'User id: ',
        id,
      )
    }

    throw error
  }
}

export const findUsersByTimer = async (time: number) => {
  try {
    const { Items } = await dynamodb.send(
      new QueryCommand({
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
      }),
    )

    return Items?.length ? Items.map(user => unmarshall(user)) : null
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        'Database exception. findUsersByTimer error: ',
        stringify(error),
        'Time: ',
        time,
      )
    }

    throw error
  }
}
