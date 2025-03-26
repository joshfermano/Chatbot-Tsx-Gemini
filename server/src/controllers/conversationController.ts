import { Request, Response } from 'express';
import Conversation from '../models/Conversation';

export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .select('title createdAt updatedAt')
      .lean();

    const formattedConversations = conversations.map((conv) => ({
      id: conv._id.toString(),
      title: conv.title,
      timestamp: conv.updatedAt || conv.createdAt,
    }));

    res.json(formattedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};

export const createConversation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { title } = req.body;

    console.log(
      'Creating conversation for user:',
      userId,
      'with title:',
      title
    );

    const conversation = await Conversation.create({
      userId,
      title: title || 'New Chat',
      messages: [],
    });

    console.log('Conversation created:', conversation._id);

    res.status(201).json({
      id: conversation._id.toString(),
      title: conversation.title,
      timestamp: conversation.createdAt,
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Failed to create conversation' });
  }
};

export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const conversation = await Conversation.findOne({
      _id: id,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({ messages: conversation.messages });
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    res.status(500).json({ message: 'Failed to fetch conversation messages' });
  }
};

export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    console.log('Deleting conversation:', id, 'for user:', userId);

    const conversation = await Conversation.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ message: 'Failed to delete conversation' });
  }
};
