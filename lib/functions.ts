export const generateId = (id1: any, id2: any) =>
  id1 > id2 ? id1 + id2 : id2 + id1;

export const getMatchedUser = (users: any, userLoggedInId: any) => {
  const newUsers = { ...users };

  delete newUsers[userLoggedInId];

  const [id, user]: any = Object.entries(newUsers).flat();

  return { id, ...user };
};
