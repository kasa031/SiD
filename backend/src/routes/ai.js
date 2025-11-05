import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load env file only if not set (Railway sets env vars automatically)
if (!process.env.OPENROUTER_API_KEY) {
  dotenv.config({ path: join(__dirname, '../../env') });
}

const router = express.Router();

// OpenRouter API endpoint
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Helper function to call OpenRouter API
async function callOpenRouterAPI(messages, model = 'openai/gpt-3.5-turbo') {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'SiD Polls Platform'
      },
      body: JSON.stringify({
        model: model,
        messages: messages
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}

// Generate poll suggestions based on topic
router.post('/suggest-poll', authenticateToken, async (req, res) => {
  try {
    const { topic, category } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `Based on the topic "${topic}"${category ? ` in the category "${category}"` : ''}, suggest:
1. A clear, engaging poll title (max 100 characters)
2. A brief description (max 200 characters)
3. 3-4 poll options that are relevant and balanced

Respond in JSON format:
{
  "title": "Poll title here",
  "description": "Poll description here",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
}`;

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant that creates engaging, balanced polls for a democratic platform. Always respond in valid JSON format.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await callOpenRouterAPI(messages);
    
    // Try to parse JSON from response
    let pollData;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || response.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;
      pollData = JSON.parse(jsonString);
    } catch (parseError) {
      // Fallback: try to extract structured data
      pollData = {
        title: topic,
        description: response.substring(0, 200),
        options: ['Ja', 'Nei', 'Vet ikke']
      };
    }

    res.json({
      success: true,
      poll: pollData
    });
  } catch (error) {
    console.error('Suggest poll error:', error);
    res.status(500).json({ 
      error: 'Kunne ikke generere poll-forslag. Prøv igjen senere.' 
    });
  }
});

// Analyze poll comments sentiment
router.post('/analyze-comments', authenticateToken, async (req, res) => {
  try {
    const { comments } = req.body;

    if (!Array.isArray(comments) || comments.length === 0) {
      return res.status(400).json({ error: 'Comments array is required' });
    }

    const commentsText = comments.map((c, i) => `${i + 1}. ${c.content}`).join('\n');

    const prompt = `Analyze the sentiment of these poll comments and provide a brief summary (max 150 words):

${commentsText}

Respond with a JSON object:
{
  "summary": "Brief summary of overall sentiment",
  "sentiment": "positive" | "negative" | "neutral" | "mixed"
}`;

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant that analyzes text sentiment. Always respond in valid JSON format.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await callOpenRouterAPI(messages);
    
    let analysis;
    try {
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || response.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;
      analysis = JSON.parse(jsonString);
    } catch (parseError) {
      analysis = {
        summary: 'Kunne ikke analysere kommentarer.',
        sentiment: 'neutral'
      };
    }

    res.json({
      success: true,
      analysis: analysis
    });
  } catch (error) {
    console.error('Analyze comments error:', error);
    res.status(500).json({ 
      error: 'Kunne ikke analysere kommentarer. Prøv igjen senere.' 
    });
  }
});

export default router;

