interface SetUserNameResponse {
  profile: BrazenAPIUserProfileData;
}

interface BrazenAPIUserProfileData {
  Name: string;
  IconId: string;
  token: string;
}

export async function setUserName(
  token: string,
  name: string,
): Promise<SetUserNameResponse> {
  return await brazenMessagePackApiRequest<SetUserNameResponse>(
    "userpreferences/v1/save_partial",
    "POST",
    { Authorization: `Bearer ${token}` },
    { Profile: { Name: name } },
  );
}
