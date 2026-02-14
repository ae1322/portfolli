const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET /api/admin/users — List all users (admin only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/admin/posts/:id — Delete any post (admin only)
router.delete('/posts/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', req.params.id);

        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: 'Post deleted by admin' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/admin/users/:id/role — Change user role (admin only)
router.put('/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const { data, error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
