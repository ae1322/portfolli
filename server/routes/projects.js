const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

// GET /api/projects — List current user's projects
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/projects/user/:userId — Public: list user projects
router.get('/user/:userId', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', req.params.userId)
            .order('created_at', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/projects — Create a project
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, tech_stack, live_url, repo_url, image_url } = req.body;

        const { data, error } = await supabase
            .from('projects')
            .insert({
                user_id: req.user.id,
                title, description, tech_stack, live_url, repo_url, image_url
            })
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/projects/:id — Update a project
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, tech_stack, live_url, repo_url, image_url } = req.body;

        const { data, error } = await supabase
            .from('projects')
            .update({ title, description, tech_stack, live_url, repo_url, image_url })
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/projects/:id — Delete a project
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);

        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
