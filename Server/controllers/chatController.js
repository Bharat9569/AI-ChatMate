import Chat from '../models/Chat.js';
import { getAIResponse } from '../services/openaiService.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get AI Response from service
    const aiResponse = await getAIResponse(message);

    // Save the conversation
    const chat = await Chat.create({
      user: userId,
      message,
      response: aiResponse,
    });

    res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};

// Optional: Get all chats for a user
export const getUserChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (err) {
    next(err);
  }
};
