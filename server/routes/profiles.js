const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

// GET /api/profiles/me — Get current user's profile
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/profiles/me — Update current user's profile
router.put('/me', authMiddleware, async (req, res) => {
    try {
        const { full_name, bio, linkedin, github, website, avatar_url } = req.body;

        const { data, error } = await supabase
            .from('profiles')
            .update({ full_name, bio, linkedin, github, website, avatar_url, updated_at: new Date().toISOString() })
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/profiles/:id — Get public profile
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, bio, linkedin, github, website, created_at')
            .eq('id', req.params.id)
            .single();

        if (error) return res.status(404).json({ error: 'Profile not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
