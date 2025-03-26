import { Request, Response } from 'express';
import { generateSafeResponse } from '../config/gemini';
import { model } from '../config/gemini';
import Conversation from '../models/Conversation';

async function generateResponse(message: string): Promise<string> {
  try {
    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate response');
  }
}

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { message, conversationId } = req.body;

    // Handle guest mode
    if (conversationId === 'guest') {
      try {
        const text = await generateSafeResponse(message);
        res.json({
          response: text,
          conversationId: 'guest',
          success: true,
        });
      } catch (error) {
        console.error('Error in guest chat:', error);
        res.status(500).json({
          message: 'Failed to generate response',
          success: false,
        });
      }
      return;
    }

    // For authenticated users
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user.id,
    });

    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    // Update conversation title for first message
    if (conversation.messages.length === 0) {
      conversation.title =
        message.length > 50 ? `${message.slice(0, 50)}...` : message;
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
    });

    // Generate and add AI response
    const text = await generateSafeResponse(message);
    conversation.messages.push({
      role: 'model',
      content: text,
    });

    await conversation.save();

    res.json({
      response: text,
      title: conversation.title,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({
      message: 'Failed to process message',
      success: false,
    });
  }
};
