const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

// POST /api/comments — Add a comment to a post
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { post_id, content } = req.body;

        if (!post_id || !content) {
            return res.status(400).json({ error: 'post_id and content are required' });
        }

        const { data, error } = await supabase
            .from('comments')
            .insert({ post_id, user_id: req.user.id, content })
            .select(`
        *,
        profiles:user_id (id, full_name, avatar_url)
      `)
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/comments/:id — Delete a comment (owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);

        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
