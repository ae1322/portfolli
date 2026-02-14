const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

// GET /api/posts — List all posts (with author & category)
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;

        let query = supabase
            .from('posts')
            .select(`
        *,
        profiles:user_id (id, full_name, avatar_url),
        categories:category_id (id, name)
      `)
            .order('created_at', { ascending: false });

        if (category) {
            query = query.eq('category_id', category);
        }

        const { data, error } = await query;
        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/posts/categories — List all categories
router.get('/categories', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/posts/:id — Get a single post with comments
router.get('/:id', async (req, res) => {
    try {
        const { data: post, error } = await supabase
            .from('posts')
            .select(`
        *,
        profiles:user_id (id, full_name, avatar_url),
        categories:category_id (id, name)
      `)
            .eq('id', req.params.id)
            .single();

        if (error) return res.status(404).json({ error: 'Post not found' });

        const { data: comments } = await supabase
            .from('comments')
            .select(`
        *,
        profiles:user_id (id, full_name, avatar_url)
      `)
            .eq('post_id', req.params.id)
            .order('created_at', { ascending: true });

        res.json({ ...post, comments: comments || [] });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/posts — Create a post
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, content, category_id } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const { data, error } = await supabase
            .from('posts')
            .insert({ user_id: req.user.id, title, content, category_id })
            .select(`
        *,
        profiles:user_id (id, full_name, avatar_url),
        categories:category_id (id, name)
      `)
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/posts/:id — Delete a post (owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);

        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
