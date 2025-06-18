import { Request, Response } from 'express';
import axios from 'axios'
import dotenv from 'dotenv';
dotenv.config();

const clientID = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET

export const redirectToGitHub = (_req: Request, res: Response) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
  res.redirect(redirectUrl);
};

export const githubOauthCallback = async (req: Request, res: Response): Promise<void> => {
 const requestToken = req.query.code as string;

  try {
    const tokenResponse = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: clientID,
        client_secret: clientSecret,
        code: requestToken,
      },
      {
        headers: { accept: 'application/json' },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log("response", userResponse)

    // You can return user info or create session/token here
    res.json({
      token: accessToken,
      user: userResponse.data,
    });
  } catch (error) {
    console.error('GitHub login error:', error);
    res.status(500).json({ error: 'Failed to login with GitHub' });
  }
}