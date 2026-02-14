const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/certificates — List current user's certificates
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/certificates/user/:userId — Public: list user certificates
router.get('/user/:userId', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', req.params.userId)
            .order('created_at', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/certificates — Upload a certificate (with PDF file)
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const { title, issuer, issue_date } = req.body;
        let file_url = null;

        // Upload file to Supabase Storage
        if (req.file) {
            const fileName = `${req.user.id}/${Date.now()}-${req.file.originalname}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('certificates')
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false,
                });

            if (uploadError) return res.status(400).json({ error: uploadError.message });

            const { data: urlData } = supabase.storage
                .from('certificates')
                .getPublicUrl(fileName);

            file_url = urlData.publicUrl;
        }

        const { data, error } = await supabase
            .from('certificates')
            .insert({ user_id: req.user.id, title, issuer, issue_date, file_url })
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/certificates/:id — Delete a certificate
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Verify ownership
        const { data: cert } = await supabase
            .from('certificates')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .single();

        if (!cert) return res.status(404).json({ error: 'Certificate not found' });

        // Delete file from storage if exists
        if (cert.file_url) {
            const filePath = cert.file_url.split('/certificates/')[1];
            if (filePath) {
                await supabase.storage.from('certificates').remove([filePath]);
            }
        }

        const { error } = await supabase
            .from('certificates')
            .delete()
            .eq('id', req.params.id);

        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: 'Certificate deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
