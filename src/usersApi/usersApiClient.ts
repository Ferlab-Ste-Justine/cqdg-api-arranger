import fetch from 'node-fetch';

import { usersApiURL } from '../config/env';
import { SetSqon, Sort } from '../endpoints/sets/setsTypes';
import { UsersApiError } from './UsersApiError';

export type CreateUpdateBody = {
  alias: string;
  content: Content;
  sharedPublicly: boolean;
};

export type Content = {
  setType: string;
  ids: string[];
  sqon: SetSqon;
  sort: Sort[];
  idField: string;
};

export type Output = {
  id: string;
  uid: string;
  content: Content;
  alias: string;
  sharedPublicly: boolean;
  creationDate: Date;
  updatedDate: Date;
  updated_date: Date;
};

export const getUserContents = async (accessToken: string): Promise<Output[]> => {
  const uri = `${usersApiURL}/user-sets`;

  const response = await fetch(encodeURI(uri), {
    method: 'get',
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
    },
  });

  const body = await response.json();

  if (response.status === 200) {
    return body;
  }

  throw new UsersApiError(response.status, body);
};

export const postUserContent = async (accessToken: string, set: CreateUpdateBody): Promise<Output> => {
  const uri = `${usersApiURL}/user-sets`;

  const response = await fetch(encodeURI(uri), {
    method: 'post',
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(set),
  });

  const body = await response.json();

  if (response.status < 300) {
    return body;
  }

  throw new UsersApiError(response.status, body);
};

export const putUserContent = async (accessToken: string, set: CreateUpdateBody, setId: string): Promise<Output> => {
  const uri = `${usersApiURL}/user-sets/${setId}`;

  const response = await fetch(encodeURI(uri), {
    method: 'put',
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(set),
  });

  const body = await response.json();

  if (response.status < 300) {
    return body;
  }

  throw new UsersApiError(response.status, body);
};

export const deleteUserContent = async (accessToken: string, setId: string): Promise<boolean> => {
  const uri = `${usersApiURL}/user-sets/${setId}`;

  const response = await fetch(encodeURI(uri), {
    method: 'delete',
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 200) {
    return true;
  }

  throw new UsersApiError(response.status, response.body);
};
