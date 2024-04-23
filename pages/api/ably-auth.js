import Ably from 'ably';

export default async function handler(req, res) {
    const restClient = new Ably.Rest({ key: process.env.ABLY_API_KEY });
    const tokenRequestData = await restClient.auth.requestToken({ clientId: 'nextjs-client' });
    res.status(200).json(tokenRequestData);
}