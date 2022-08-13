export interface Profile {
  age: number;
  displayName: string;
  email: string;
  id: string;
  imgUrl: string;
  job: string;
  photoUrl: string;
  timestamp: any;
}

export interface MessageProps {
  displayName: string;
  id: string;
  userId: string;
  message: string;
  job: string;
  photoUrl: string;
  timestamp: any;
}
